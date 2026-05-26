const { getAdminClient } = require("../../lib/_supabase");
const { cleanText, slugify } = require("../../lib/_validation");
const { handleError, methodAllowed, sendJson } = require("../../lib/_http");

const DEFAULT_QUERIES = {
  "frontier-ai-audit": "frontier AI evaluation model audit safety red teaming",
  "reproducible-ai-science": "AI for science reproducibility research agents provenance",
  "validated-ai-medicine": "AI protein design drug discovery wet lab validation",
  "pandemic-early-warning": "pandemic early warning genomic surveillance wastewater",
  "antimicrobial-resistance": "antimicrobial resistance diagnostics drug discovery stewardship",
  "autonomous-climate-materials": "self driving laboratory autonomous materials discovery batteries catalysts",
  "clean-power-ai-grid": "clean power grid storage critical minerals AI data centers",
  "resilient-food-systems": "resilient food systems nitrogen water stress soil carbon",
  "robotic-science-work": "robotic laboratory automation embodied AI science",
  "science-to-company": "science commercialization technology transfer deep tech venture creation",
};

function authorized(req) {
  const expected = process.env.CRON_SECRET;
  if (!expected) {
    if (process.env.VERCEL === "1") {
      return false;
    }
    return true;
  }
  return req.headers.authorization === `Bearer ${expected}`;
}

function missingSupabaseEnv() {
  return ["SUPABASE_URL", "SUPABASE_ANON_KEY", "SUPABASE_SERVICE_ROLE_KEY"].filter(
    (key) => !process.env[key],
  );
}

async function pingSupabaseGateway() {
  const supabaseUrl = process.env.SUPABASE_URL;
  if (!supabaseUrl) {
    return { pinged: false, reason: "SUPABASE_URL is missing" };
  }

  const url = new URL("/rest/v1/", supabaseUrl);
  const response = await fetch(url, {
    method: "HEAD",
    headers: {
      "User-Agent": "AISci.fans Atlas health check (mailto:19800104zhao@gmail.com)",
    },
  });

  return {
    pinged: true,
    status: response.status,
    projectRef: response.headers.get("sb-project-ref") || null,
    requestId: response.headers.get("sb-request-id") || null,
  };
}

function sourceUrlFromDoi(doi) {
  return doi ? `https://doi.org/${String(doi).replace(/^https?:\/\/doi.org\//i, "")}` : "";
}

function normalizeDoi(value) {
  return cleanText(value, 240)
    .replace(/^https?:\/\/doi.org\//i, "")
    .replace(/^doi:/i, "")
    .toLowerCase();
}

function authorSlug(name) {
  return slugify(name) || `scientist-${Math.random().toString(36).slice(2, 10)}`;
}

function openAlexAbstract(work) {
  const inverted = work.abstract_inverted_index;
  if (!inverted || typeof inverted !== "object") {
    return "";
  }
  const words = [];
  Object.entries(inverted).forEach(([word, positions]) => {
    (positions || []).forEach((position) => {
      words[position] = word;
    });
  });
  return words.filter(Boolean).join(" ").slice(0, 2200);
}

function openAlexPaper(work, problemId) {
  const doi = normalizeDoi(work.doi);
  const authors = (work.authorships || []).slice(0, 12).map((authorship) => ({
    name: authorship.author?.display_name || "",
    openalex_id: authorship.author?.id || "",
    orcid: authorship.author?.orcid || "",
    institution: authorship.institutions?.[0]?.display_name || "",
  }));
  return {
    problem_id: problemId,
    title: cleanText(work.title || work.display_name, 500),
    abstract: openAlexAbstract(work),
    doi: doi || null,
    openalex_id: work.id || null,
    semantic_scholar_id: null,
    arxiv_id: null,
    source: "OpenAlex",
    source_url: sourceUrlFromDoi(doi) || work.id || work.primary_location?.landing_page_url || null,
    year: work.publication_year || null,
    venue: work.primary_location?.source?.display_name || work.host_venue?.display_name || null,
    authors,
    status: "pending",
    confidence: Math.min(0.92, 0.64 + Math.min(Number(work.cited_by_count || 0), 300) / 1200),
  };
}

function semanticScholarPaper(paper, problemId) {
  const doi = normalizeDoi(paper.externalIds?.DOI);
  const authors = (paper.authors || []).slice(0, 12).map((author) => ({
    name: author.name || "",
    semantic_scholar_id: author.authorId || "",
  }));
  return {
    problem_id: problemId,
    title: cleanText(paper.title, 500),
    abstract: cleanText(paper.abstract, 2200),
    doi: doi || null,
    openalex_id: null,
    semantic_scholar_id: paper.paperId || null,
    arxiv_id: paper.externalIds?.ArXiv || null,
    source: "Semantic Scholar",
    source_url: sourceUrlFromDoi(doi) || paper.url || null,
    year: paper.year || null,
    venue: paper.venue || null,
    authors,
    status: "pending",
    confidence: Math.min(0.9, 0.62 + Math.min(Number(paper.citationCount || 0), 300) / 1300),
  };
}

async function fetchJson(url, headers = {}) {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "AISci.fans Atlas ingestion (mailto:19800104zhao@gmail.com)",
      ...headers,
    },
  });
  if (!response.ok) {
    const error = new Error(`Fetch failed: ${response.status} ${response.statusText}`);
    error.statusCode = 502;
    throw error;
  }
  return response.json();
}

async function fetchOpenAlex(query) {
  const url = new URL("https://api.openalex.org/works");
  url.searchParams.set("search", query);
  url.searchParams.set("per-page", "5");
  url.searchParams.set("sort", "cited_by_count:desc");
  url.searchParams.set("mailto", "19800104zhao@gmail.com");
  const json = await fetchJson(url);
  return json.results || [];
}

async function fetchSemanticScholar(query) {
  const url = new URL("https://api.semanticscholar.org/graph/v1/paper/search");
  url.searchParams.set("query", query);
  url.searchParams.set("limit", "5");
  url.searchParams.set(
    "fields",
    "paperId,title,abstract,year,venue,url,authors,externalIds,citationCount",
  );
  const headers = process.env.SEMANTIC_SCHOLAR_API_KEY
    ? { "x-api-key": process.env.SEMANTIC_SCHOLAR_API_KEY }
    : {};
  const json = await fetchJson(url, headers);
  return json.data || [];
}

async function upsertScientist(supabase, author, problemId, source) {
  const name = cleanText(author.name, 180);
  if (!name) {
    return null;
  }
  const slug = authorSlug(name);
  const payload = {
    slug,
    full_name: name,
    affiliation: author.institution || null,
    orcid: author.orcid || null,
    openalex_id: author.openalex_id || null,
    semantic_scholar_id: author.semantic_scholar_id || null,
    expertise: [],
    source,
    source_url: author.openalex_id || null,
    status: "pending",
    confidence: 0.62,
    updated_at: new Date().toISOString(),
  };

  const { data: existing, error: findError } = await supabase
    .from("scientists")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();
  if (findError) {
    findError.statusCode = 500;
    throw findError;
  }

  const request = existing
    ? supabase.from("scientists").update(payload).eq("id", existing.id).select("id").single()
    : supabase.from("scientists").insert(payload).select("id").single();
  const { data, error } = await request;
  if (error) {
    error.statusCode = 500;
    throw error;
  }

  const { error: linkError } = await supabase.from("problem_scientists").upsert(
    {
      problem_id: problemId,
      scientist_id: data.id,
      relationship: "author",
      confidence: 0.58,
    },
    { onConflict: "problem_id,scientist_id" },
  );
  if (linkError) {
    linkError.statusCode = 500;
    throw linkError;
  }
  return data.id;
}

async function upsertPaper(supabase, paper) {
  const filters = [
    paper.doi ? ["doi", paper.doi] : null,
    paper.openalex_id ? ["openalex_id", paper.openalex_id] : null,
    paper.semantic_scholar_id ? ["semantic_scholar_id", paper.semantic_scholar_id] : null,
  ].filter(Boolean);

  let existing = null;
  for (const [field, value] of filters) {
    const { data, error } = await supabase.from("papers").select("id").eq(field, value).maybeSingle();
    if (error) {
      error.statusCode = 500;
      throw error;
    }
    if (data) {
      existing = data;
      break;
    }
  }

  const payload = {
    ...paper,
    updated_at: new Date().toISOString(),
  };
  const request = existing
    ? supabase.from("papers").update(payload).eq("id", existing.id).select("id").single()
    : supabase.from("papers").insert(payload).select("id").single();
  const { data, error } = await request;
  if (error) {
    error.statusCode = 500;
    throw error;
  }

  for (const author of paper.authors || []) {
    await upsertScientist(supabase, author, paper.problem_id, paper.source);
  }
  return data.id;
}

async function logRun(supabase, runId, source, problemId, status, message, count = 0) {
  await supabase.from("ingestion_logs").insert({
    run_id: runId,
    source,
    problem_id: problemId,
    status,
    message: cleanText(message, 1200),
    record_count: count,
  });
}

module.exports = async function handler(req, res) {
  try {
    if (!methodAllowed(req, res, ["GET"])) {
      return;
    }
    if (!authorized(req)) {
      return sendJson(res, 401, { error: "Unauthorized cron invocation" });
    }

    const missingEnv = missingSupabaseEnv();
    if (missingEnv.length) {
      const gateway = await pingSupabaseGateway();
      return sendJson(res, 200, {
        ok: false,
        status: "supabase_not_configured",
        missingEnv,
        gateway,
      });
    }

    const supabase = getAdminClient();
    const { data: run, error: runError } = await supabase
      .from("ingestion_runs")
      .insert({ status: "running", started_at: new Date().toISOString() })
      .select("id")
      .single();
    if (runError) {
      runError.statusCode = 500;
      throw runError;
    }

    let inserted = 0;
    let failures = 0;

    try {
      const { data: problems, error } = await supabase
        .from("research_problems")
        .select("id, slug, title, search_query")
        .eq("status", "public")
        .order("score", { ascending: false })
        .limit(10);
      if (error) {
        error.statusCode = 500;
        throw error;
      }

      for (const problem of problems || []) {
        const query = problem.search_query || DEFAULT_QUERIES[problem.slug] || problem.title;
        try {
          const works = await fetchOpenAlex(query);
          for (const work of works) {
            const normalized = openAlexPaper(work, problem.id);
            if (normalized.title && normalized.source_url) {
              await upsertPaper(supabase, normalized);
              inserted += 1;
            }
          }
          await logRun(supabase, run.id, "OpenAlex", problem.id, "success", query, works.length);
        } catch (error) {
          failures += 1;
          await logRun(supabase, run.id, "OpenAlex", problem.id, "failed", error.message);
        }

        try {
          const papers = await fetchSemanticScholar(query);
          for (const paper of papers) {
            const normalized = semanticScholarPaper(paper, problem.id);
            if (normalized.title && normalized.source_url) {
              await upsertPaper(supabase, normalized);
              inserted += 1;
            }
          }
          await logRun(supabase, run.id, "Semantic Scholar", problem.id, "success", query, papers.length);
        } catch (error) {
          failures += 1;
          await logRun(supabase, run.id, "Semantic Scholar", problem.id, "failed", error.message);
        }
      }

      const finalStatus = failures ? "partial_success" : "success";
      await supabase
        .from("ingestion_runs")
        .update({
          status: finalStatus,
          finished_at: new Date().toISOString(),
          records_seen: inserted,
          error_message: failures ? `${failures} source/problem fetches failed` : null,
        })
        .eq("id", run.id);

      sendJson(res, 200, { ok: true, status: finalStatus, recordsSeen: inserted, failures });
    } catch (error) {
      await supabase
        .from("ingestion_runs")
        .update({
          status: "failed",
          finished_at: new Date().toISOString(),
          error_message: error.message,
        })
        .eq("id", run.id);
      throw error;
    }
  } catch (error) {
    handleError(res, error);
  }
};
