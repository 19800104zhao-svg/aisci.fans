const { getAdminClient } = require("../lib/_supabase");
const { handleError, methodAllowed, sendJson } = require("../lib/_http");

async function attachProblemCounts(supabase, problems) {
  if (!problems.length) {
    return problems;
  }
  const ids = problems.map((problem) => problem.id);
  const [{ data: papers }, { data: scientists }, { data: progress }] = await Promise.all([
    supabase.from("papers").select("problem_id").in("problem_id", ids).eq("status", "public"),
    supabase
      .from("problem_scientists")
      .select("problem_id, scientists!inner(status)")
      .in("problem_id", ids)
      .eq("scientists.status", "public"),
    supabase.from("problem_progress").select("problem_id").in("problem_id", ids).eq("status", "public"),
  ]);

  const counts = new Map(ids.map((id) => [id, { papers: 0, scientists: 0, progress: 0 }]));
  (papers || []).forEach((row) => counts.get(row.problem_id).papers += 1);
  (scientists || []).forEach((row) => counts.get(row.problem_id).scientists += 1);
  (progress || []).forEach((row) => counts.get(row.problem_id).progress += 1);
  return problems.map((problem) => ({ ...problem, counts: counts.get(problem.id) }));
}

module.exports = async function handler(req, res) {
  try {
    if (!methodAllowed(req, res, ["GET"])) {
      return;
    }

    const url = new URL(req.url, `https://${req.headers.host}`);
    const query = String(url.searchParams.get("q") || "").trim();
    const domain = String(url.searchParams.get("domain") || "").trim();
    const supabase = getAdminClient();

    let request = supabase
      .from("research_problems")
      .select(
        "id, slug, title, summary, domain, score, progress_summary, bottlenecks, source_urls, confidence, updated_at",
      )
      .eq("status", "public")
      .order("score", { ascending: false })
      .limit(50);

    if (domain && domain !== "all") {
      request = request.eq("domain", domain);
    }
    if (query) {
      const safeQuery = query.replace(/[,%()]/g, " ").slice(0, 120);
      request = request.or(`title.ilike.%${safeQuery}%,summary.ilike.%${safeQuery}%,domain.ilike.%${safeQuery}%`);
    }

    const { data, error } = await request;
    if (error) {
      error.statusCode = 500;
      throw error;
    }

    sendJson(res, 200, { problems: await attachProblemCounts(supabase, data || []) });
  } catch (error) {
    handleError(res, error);
  }
};
