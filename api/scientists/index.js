const { getAdminClient } = require("../../lib/_supabase");
const { cleanText } = require("../../lib/_validation");
const { handleError, methodAllowed, sendJson } = require("../../lib/_http");

module.exports = async function handler(req, res) {
  try {
    if (!methodAllowed(req, res, ["GET"])) {
      return;
    }

    const url = new URL(req.url, `https://${req.headers.host}`);
    const id = cleanText(url.searchParams.get("id") || url.searchParams.get("slug"), 160);
    const search = cleanText(url.searchParams.get("q"), 160);
    const supabase = getAdminClient();

    if (id) {
      const field = /^[0-9a-f-]{32,36}$/i.test(id) ? "id" : "slug";
      const { data: scientist, error } = await supabase
        .from("scientists")
        .select("*")
        .eq(field, id)
        .eq("status", "public")
        .maybeSingle();

      if (error) {
        error.statusCode = 500;
        throw error;
      }
      if (!scientist) {
        return sendJson(res, 404, { error: "Scientist not found" });
      }

      const [{ data: problemLinks, error: problemError }, { data: papers, error: paperError }] = await Promise.all([
        supabase
          .from("problem_scientists")
          .select("relationship, confidence, research_problems(id, slug, title, summary, domain, score)")
          .eq("scientist_id", scientist.id)
          .eq("research_problems.status", "public"),
        supabase
          .from("papers")
          .select("*")
          .contains("authors", [{ name: scientist.full_name }])
          .eq("status", "public")
          .order("year", { ascending: false })
          .limit(20),
      ]);

      for (const apiError of [problemError, paperError].filter(Boolean)) {
        apiError.statusCode = 500;
        throw apiError;
      }

      return sendJson(res, 200, {
        scientist,
        problems: (problemLinks || []).map((link) => ({
          relationship: link.relationship,
          confidence: link.confidence,
          ...(link.research_problems || {}),
        })),
        papers: papers || [],
      });
    }

    let request = supabase
      .from("scientists")
      .select("id, slug, full_name, affiliation, expertise, orcid, website, confidence")
      .eq("status", "public")
      .order("confidence", { ascending: false })
      .limit(40);

    if (search) {
      const safeSearch = search.replace(/[,%()]/g, " ").slice(0, 120);
      request = request.or(`full_name.ilike.%${safeSearch}%,affiliation.ilike.%${safeSearch}%`);
    }

    const { data, error } = await request;
    if (error) {
      error.statusCode = 500;
      throw error;
    }

    sendJson(res, 200, { scientists: data || [] });
  } catch (error) {
    handleError(res, error);
  }
};
