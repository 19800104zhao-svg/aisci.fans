const { getAdminClient, requireAdmin, shapeProfile } = require("../../lib/_supabase");
const { cleanText, requireAllowed } = require("../../lib/_validation");
const { handleError, methodAllowed, readJson, requireSameOrigin, sendJson } = require("../../lib/_http");

const ENTITY_TABLES = {
  submission: "submissions",
  discussion: "problem_discussions",
  claim_request: "claim_requests",
  research_problem: "research_problems",
  problem_progress: "problem_progress",
  paper: "papers",
  scientist: "scientists",
  flag: "flags",
};
const DECISIONS = ["approve", "reject", "mark_private", "mark_public", "flag", "resolve"];

function adminAction(req) {
  const pathname = new URL(req.url, `https://${req.headers.host}`).pathname;
  return pathname.split("/").filter(Boolean).pop();
}

async function selectOrEmpty(query) {
  const { data, error } = await query;
  if (error) {
    error.statusCode = 500;
    throw error;
  }
  return data || [];
}

function statusFor(entityType, decision) {
  if (entityType === "flag" && decision === "resolve") {
    return "resolved";
  }
  if (entityType === "submission" && decision === "approve") {
    return "approved";
  }
  if (entityType === "discussion" && decision === "approve") {
    return "public";
  }
  if (entityType === "claim_request" && decision === "approve") {
    return "approved";
  }
  if (decision === "approve" || decision === "mark_public") {
    return "public";
  }
  if (decision === "reject") {
    return "rejected";
  }
  if (decision === "flag") {
    return "flagged";
  }
  return "private";
}

async function applyClaimSideEffects(supabase, claimId, note, status) {
  if (status !== "approved" && status !== "public") {
    return;
  }
  const { data: claim, error } = await supabase
    .from("claim_requests")
    .select("scientist_id, user_id")
    .eq("id", claimId)
    .maybeSingle();
  if (error) {
    error.statusCode = 500;
    throw error;
  }
  if (!claim?.scientist_id) {
    return;
  }
  const { error: updateError } = await supabase
    .from("scientists")
    .update({
      claimed_by: claim.user_id,
      claim_status: "verified",
      admin_note: note || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", claim.scientist_id);
  if (updateError) {
    updateError.statusCode = 500;
    throw updateError;
  }
}

async function queue(req, res) {
  if (!methodAllowed(req, res, ["GET"])) {
    return;
  }

  const admin = await requireAdmin(req);
  const supabase = getAdminClient();

  const [
    profiles,
    submissions,
    discussions,
    claimRequests,
    follows,
    flags,
    ingestionRuns,
    ingestionLogs,
    pendingProblems,
    pendingPapers,
    pendingScientists,
  ] = await Promise.all([
    selectOrEmpty(
      supabase
        .from("profiles")
        .select("id, email, display_name, role, organization, country, headline, is_admin, created_at")
        .order("created_at", { ascending: false })
        .limit(100),
    ),
    selectOrEmpty(
      supabase
        .from("submissions")
        .select("*, profiles(email, display_name), research_problems(slug, title)")
        .order("created_at", { ascending: false })
        .limit(100),
    ),
    selectOrEmpty(
      supabase
        .from("problem_discussions")
        .select("*, profiles(email, display_name), research_problems(slug, title)")
        .order("created_at", { ascending: false })
        .limit(100),
    ),
    selectOrEmpty(
      supabase
        .from("claim_requests")
        .select("*, profiles(email, display_name), scientists(slug, full_name, affiliation)")
        .order("created_at", { ascending: false })
        .limit(100),
    ),
    selectOrEmpty(
      supabase
        .from("follows")
        .select("id, created_at, profiles(email, display_name), research_problems(slug, title)")
        .order("created_at", { ascending: false })
        .limit(100),
    ),
    selectOrEmpty(supabase.from("flags").select("*").order("created_at", { ascending: false }).limit(100)),
    selectOrEmpty(supabase.from("ingestion_runs").select("*").order("created_at", { ascending: false }).limit(20)),
    selectOrEmpty(supabase.from("ingestion_logs").select("*").order("created_at", { ascending: false }).limit(100)),
    selectOrEmpty(
      supabase
        .from("research_problems")
        .select("*")
        .neq("status", "public")
        .order("updated_at", { ascending: false })
        .limit(50),
    ),
    selectOrEmpty(
      supabase
        .from("papers")
        .select("*, research_problems(slug, title)")
        .neq("status", "public")
        .order("created_at", { ascending: false })
        .limit(100),
    ),
    selectOrEmpty(
      supabase
        .from("scientists")
        .select("*")
        .neq("status", "public")
        .order("created_at", { ascending: false })
        .limit(100),
    ),
  ]);

  sendJson(res, 200, {
    admin: shapeProfile(admin.profile),
    profiles,
    submissions,
    discussions,
    claimRequests,
    follows,
    flags,
    ingestionRuns,
    ingestionLogs,
    pendingProblems,
    pendingPapers,
    pendingScientists,
  });
}

async function review(req, res) {
  if (!methodAllowed(req, res, ["POST"]) || !requireSameOrigin(req, res)) {
    return;
  }

  const admin = await requireAdmin(req);
  const body = await readJson(req);
  const entityType = requireAllowed(body.entityType, Object.keys(ENTITY_TABLES), "");
  const entityId = cleanText(body.entityId, 80);
  const decision = requireAllowed(body.decision, DECISIONS, "");
  const note = cleanText(body.note, 1200);

  if (!entityType || !entityId || !decision) {
    return sendJson(res, 400, { error: "entityType, entityId, and decision are required" });
  }

  const status = statusFor(entityType, decision);
  const supabase = getAdminClient();
  const table = ENTITY_TABLES[entityType];

  const updates = {
    status,
    admin_note: note || null,
    reviewed_by: admin.id,
    reviewed_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  if (entityType === "submission" || entityType === "discussion") {
    updates.visibility = status === "public" ? "public" : "private";
  }
  if (entityType === "scientist" && status === "public") {
    updates.claim_status = "unclaimed";
  }

  const { data, error } = await supabase.from(table).update(updates).eq("id", entityId).select("*").single();
  if (error) {
    error.statusCode = 500;
    throw error;
  }

  await applyClaimSideEffects(supabase, entityId, note, status);

  const { error: reviewError } = await supabase.from("admin_reviews").insert({
    reviewer_id: admin.id,
    entity_type: entityType,
    entity_id: entityId,
    decision,
    note: note || null,
  });
  if (reviewError) {
    reviewError.statusCode = 500;
    throw reviewError;
  }

  sendJson(res, 200, { review: { entityType, entityId, decision, status }, entity: data });
}

module.exports = async function handler(req, res) {
  try {
    const action = adminAction(req);
    if (action === "queue") {
      return await queue(req, res);
    }
    if (action === "review") {
      return await review(req, res);
    }
    return sendJson(res, 404, { error: "Admin action not found" });
  } catch (error) {
    handleError(res, error);
  }
};
