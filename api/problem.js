const { getAdminClient } = require("../lib/_supabase");
const { cleanText } = require("../lib/_validation");
const { handleError, methodAllowed, sendJson } = require("../lib/_http");

async function getProblemByIdOrSlug(supabase, idOrSlug) {
  const field = /^[0-9a-f-]{32,36}$/i.test(idOrSlug) ? "id" : "slug";
  const { data, error } = await supabase
    .from("research_problems")
    .select("*")
    .eq(field, idOrSlug)
    .eq("status", "public")
    .maybeSingle();

  if (error) {
    error.statusCode = 500;
    throw error;
  }
  return data;
}

module.exports = async function handler(req, res) {
  try {
    if (!methodAllowed(req, res, ["GET"])) {
      return;
    }

    const url = new URL(req.url, `https://${req.headers.host}`);
    const id = cleanText(url.searchParams.get("id") || url.searchParams.get("slug"), 160);
    if (!id) {
      return sendJson(res, 400, { error: "Problem id or slug is required" });
    }

    const supabase = getAdminClient();
    const problem = await getProblemByIdOrSlug(supabase, id);
    if (!problem) {
      return sendJson(res, 404, { error: "Problem not found" });
    }

    const [{ data: progress, error: progressError }, { data: papers, error: papersError }, { data: links, error: linksError }] =
      await Promise.all([
        supabase
          .from("problem_progress")
          .select("*")
          .eq("problem_id", problem.id)
          .eq("status", "public")
          .order("created_at", { ascending: false })
          .limit(12),
        supabase
          .from("papers")
          .select("*")
          .eq("problem_id", problem.id)
          .eq("status", "public")
          .order("confidence", { ascending: false })
          .order("year", { ascending: false })
          .limit(20),
        supabase
          .from("problem_scientists")
          .select("problem_id, scientist_id, relationship, confidence, scientists(*)")
          .eq("problem_id", problem.id)
          .eq("scientists.status", "public")
          .order("confidence", { ascending: false })
          .limit(20),
      ]);

    for (const error of [progressError, papersError, linksError].filter(Boolean)) {
      error.statusCode = 500;
      throw error;
    }

    sendJson(res, 200, {
      problem,
      progress: progress || [],
      papers: papers || [],
      scientists: (links || []).map((link) => ({
        relationship: link.relationship,
        confidence: link.confidence,
        ...(link.scientists || {}),
      })),
    });
  } catch (error) {
    handleError(res, error);
  }
};
