const { getAdminClient, requireUser } = require("../lib/_supabase");
const { cleanText, cleanUrl, requireAllowed } = require("../lib/_validation");
const { handleError, methodAllowed, readJson, requireSameOrigin, sendJson } = require("../lib/_http");

const EVIDENCE_TYPES = [
  "institution_email",
  "orcid",
  "google_scholar",
  "lab_homepage",
  "corresponding_email",
  "github",
  "other",
];

async function resolveScientist(supabase, body) {
  const id = cleanText(body.scientistId || body.scientistSlug, 160);
  if (!id) {
    return null;
  }
  const field = /^[0-9a-f-]{32,36}$/i.test(id) ? "id" : "slug";
  const { data, error } = await supabase
    .from("scientists")
    .select("id, slug, full_name")
    .eq(field, id)
    .maybeSingle();
  if (error) {
    error.statusCode = 500;
    throw error;
  }
  return data;
}

module.exports = async function handler(req, res) {
  try {
    if (!methodAllowed(req, res, ["GET", "POST"])) {
      return;
    }
    if (req.method === "POST" && !requireSameOrigin(req, res)) {
      return;
    }

    const user = await requireUser(req);
    const supabase = getAdminClient();

    if (req.method === "GET") {
      const { data, error } = await supabase
        .from("claim_requests")
        .select("*, scientists(slug, full_name, affiliation)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(100);
      if (error) {
        error.statusCode = 500;
        throw error;
      }
      return sendJson(res, 200, { claims: data || [] });
    }

    const body = await readJson(req);
    const scientist = await resolveScientist(supabase, body);
    const targetName = cleanText(body.targetScientistName || scientist?.full_name, 180);
    const evidenceType = requireAllowed(body.evidenceType, EVIDENCE_TYPES, "other");
    const evidenceUrl = cleanUrl(body.evidenceUrl);
    const evidenceText = cleanText(body.evidenceText, 1800);
    const noConfidentialData = Boolean(body.noConfidentialData);

    if (!targetName || (!evidenceUrl && !evidenceText) || !noConfidentialData) {
      return sendJson(res, 400, {
        error: "Scientist name, evidence, and confidentiality acknowledgement are required",
      });
    }

    const { data, error } = await supabase
      .from("claim_requests")
      .insert({
        user_id: user.id,
        scientist_id: scientist?.id || null,
        target_scientist_name: targetName,
        evidence_type: evidenceType,
        evidence_url: evidenceUrl || null,
        evidence_payload: {
          evidenceText,
          noConfidentialData,
        },
        status: "pending",
      })
      .select("*")
      .single();

    if (error) {
      error.statusCode = 500;
      throw error;
    }

    sendJson(res, 201, { claim: data });
  } catch (error) {
    handleError(res, error);
  }
};
