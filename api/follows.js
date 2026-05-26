const { getAdminClient, requireUser } = require("../lib/_supabase");
const { cleanText } = require("../lib/_validation");
const { handleError, methodAllowed, readJson, requireSameOrigin, sendJson } = require("../lib/_http");

async function resolveProblem(supabase, value) {
  const id = cleanText(value, 160);
  if (!id) {
    return null;
  }
  const field = /^[0-9a-f-]{32,36}$/i.test(id) ? "id" : "slug";
  const { data, error } = await supabase
    .from("research_problems")
    .select("id, slug, title")
    .eq(field, id)
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
    if (!methodAllowed(req, res, ["GET", "POST", "DELETE"])) {
      return;
    }
    if (req.method !== "GET" && !requireSameOrigin(req, res)) {
      return;
    }

    const user = await requireUser(req);
    const supabase = getAdminClient();

    if (req.method === "GET") {
      const { data, error } = await supabase
        .from("follows")
        .select("id, created_at, research_problems(id, slug, title, summary, domain, score)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) {
        error.statusCode = 500;
        throw error;
      }
      return sendJson(res, 200, { follows: data || [] });
    }

    const body = await readJson(req);
    const problem = await resolveProblem(supabase, body.problemId || body.problemSlug || body.slug);
    if (!problem) {
      return sendJson(res, 404, { error: "Problem not found" });
    }

    if (req.method === "DELETE") {
      const { error } = await supabase
        .from("follows")
        .delete()
        .eq("user_id", user.id)
        .eq("problem_id", problem.id);
      if (error) {
        error.statusCode = 500;
        throw error;
      }
      return sendJson(res, 200, { ok: true, problem });
    }

    const { data, error } = await supabase
      .from("follows")
      .upsert({ user_id: user.id, problem_id: problem.id }, { onConflict: "user_id,problem_id" })
      .select("id, user_id, problem_id, created_at")
      .single();

    if (error) {
      error.statusCode = 500;
      throw error;
    }

    sendJson(res, 201, { follow: data, problem });
  } catch (error) {
    handleError(res, error);
  }
};
