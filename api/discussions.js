const { getAdminClient, getCurrentUser, requireUser } = require("../lib/_supabase");
const { cleanText, cleanUrl } = require("../lib/_validation");
const { handleError, methodAllowed, readJson, requireSameOrigin, sendJson } = require("../lib/_http");

async function getProblemBySlug(supabase, slug) {
  const { data, error } = await supabase
    .from("research_problems")
    .select("id, slug, title")
    .eq("slug", slug)
    .eq("status", "public")
    .maybeSingle();

  if (error) {
    error.statusCode = 500;
    throw error;
  }
  return data;
}

function shapeDiscussion(row) {
  return {
    id: row.id,
    title: row.title,
    body: row.body,
    sourceUrl: row.source_url,
    status: row.status,
    visibility: row.visibility,
    createdAt: row.created_at,
    author: {
      name: row.profiles?.display_name || "AISci member",
      role: row.profiles?.role || "member",
      organization: row.profiles?.organization || "",
    },
  };
}

async function listDiscussions(req, res) {
  const url = new URL(req.url, `https://${req.headers.host}`);
  const slug = cleanText(url.searchParams.get("problem") || url.searchParams.get("slug"), 160);
  if (!slug) {
    return sendJson(res, 400, { error: "problem slug is required" });
  }

  const supabase = getAdminClient();
  const problem = await getProblemBySlug(supabase, slug);
  if (!problem) {
    return sendJson(res, 404, { error: "Problem not found" });
  }

  const user = await getCurrentUser(req);
  let query = supabase
    .from("problem_discussions")
    .select("id, title, body, source_url, status, visibility, created_at, profiles(display_name, role, organization)")
    .eq("problem_id", problem.id)
    .order("created_at", { ascending: false })
    .limit(50);

  if (user?.id) {
    query = query.or(`status.eq.public,user_id.eq.${user.id}`);
  } else {
    query = query.eq("status", "public");
  }

  const { data, error } = await query;
  if (error) {
    error.statusCode = 500;
    throw error;
  }

  sendJson(res, 200, {
    problem,
    discussions: (data || []).map(shapeDiscussion),
  });
}

async function createDiscussion(req, res) {
  if (!requireSameOrigin(req, res)) {
    return;
  }

  const user = await requireUser(req);
  const body = await readJson(req);
  const problemSlug = cleanText(body.problemSlug || body.problem || body.slug, 160);
  const discussionBody = cleanText(body.body, 4000);
  const title = cleanText(body.title, 180) || discussionBody.slice(0, 90);
  const sourceUrl = cleanUrl(body.sourceUrl);

  if (!problemSlug || discussionBody.length < 12) {
    return sendJson(res, 400, { error: "problemSlug and a discussion body are required" });
  }

  const supabase = getAdminClient();
  const problem = await getProblemBySlug(supabase, problemSlug);
  if (!problem) {
    return sendJson(res, 404, { error: "Problem not found" });
  }

  const payload = {
    problem_id: problem.id,
    user_id: user.id,
    title,
    body: discussionBody,
    source_url: sourceUrl || null,
    visibility: "pending_public",
    status: "pending",
  };

  const { data, error } = await supabase
    .from("problem_discussions")
    .insert(payload)
    .select("id, title, body, source_url, status, visibility, created_at, profiles(display_name, role, organization)")
    .single();

  if (error) {
    error.statusCode = 500;
    throw error;
  }

  sendJson(res, 201, {
    discussion: shapeDiscussion(data),
    message: "Discussion saved. Founder/admin review is required before it becomes public.",
  });
}

module.exports = async function handler(req, res) {
  try {
    if (req.method === "GET") {
      return await listDiscussions(req, res);
    }
    if (req.method === "POST") {
      return await createDiscussion(req, res);
    }
    methodAllowed(req, res, ["GET", "POST"]);
  } catch (error) {
    handleError(res, error);
  }
};
