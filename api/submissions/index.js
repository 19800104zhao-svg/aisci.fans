const { getAdminClient, requireUser, shapeProfile } = require("../../lib/_supabase");
const { cleanArray, cleanText, cleanUrl, requireAllowed } = require("../../lib/_validation");
const { handleError, methodAllowed, readJson, requireSameOrigin, sendJson } = require("../../lib/_http");

const TYPES = ["talent", "lab", "capital", "proof", "interaction"];
const VISIBILITY = ["private", "pending_public"];

function cleanPayload(type, payload = {}) {
  const common = {
    problemSlug: cleanText(payload.problemSlug, 140),
    problemTitle: cleanText(payload.problemTitle, 220),
    sourceUrl: cleanUrl(payload.sourceUrl),
    notes: cleanText(payload.notes, 1800),
    noConfidentialData: Boolean(payload.noConfidentialData),
  };

  if (type === "talent") {
    return {
      ...common,
      focusArea: cleanText(payload.focusArea, 180),
      location: cleanText(payload.location, 120),
      stage: cleanText(payload.stage, 80),
      proofLinks: cleanArray(payload.proofLinks).map(cleanUrl).filter(Boolean),
      skills: cleanArray(payload.skills),
      strongestWork: cleanText(payload.strongestWork),
      mentorAsk: cleanText(payload.mentorAsk),
      portfolioUrl: cleanUrl(payload.portfolioUrl),
    };
  }

  if (type === "lab") {
    return {
      ...common,
      labName: cleanText(payload.labName, 180),
      leadName: cleanText(payload.leadName, 140),
      affiliation: cleanText(payload.affiliation, 180),
      problemArea: cleanText(payload.problemArea, 180),
      agenda: cleanText(payload.agenda),
      openRoles: cleanArray(payload.openRoles),
      dataOrEquipment: cleanText(payload.dataOrEquipment),
      commercializationBoundary: cleanText(payload.commercializationBoundary),
      website: cleanUrl(payload.website),
    };
  }

  if (type === "capital") {
    return {
      ...common,
      investorName: cleanText(payload.investorName, 140),
      firm: cleanText(payload.firm, 180),
      checkSize: cleanText(payload.checkSize, 80),
      sectors: cleanArray(payload.sectors),
      thesis: cleanText(payload.thesis),
      support: cleanText(payload.support),
      introPreference: cleanText(payload.introPreference),
      website: cleanUrl(payload.website),
    };
  }

  if (type === "proof") {
    return {
      ...common,
      title: cleanText(payload.title, 220),
      evidenceType: cleanText(payload.evidenceType, 80),
      artifactUrl: cleanUrl(payload.artifactUrl),
      summary: cleanText(payload.summary),
      reproducibilityNotes: cleanText(payload.reproducibilityNotes),
    };
  }

  return {
    ...common,
    targetType: cleanText(payload.targetType, 80),
    targetName: cleanText(payload.targetName, 180),
    request: cleanText(payload.request),
    contextUrl: cleanUrl(payload.contextUrl),
  };
}

function titleFor(type, payload) {
  return (
    payload.title ||
    payload.focusArea ||
    payload.labName ||
    payload.investorName ||
    payload.targetName ||
    `${type} submission`
  );
}

function hasRequired(type, payload) {
  if (!payload.noConfidentialData) {
    return false;
  }
  if (type === "talent") {
    return Boolean(payload.focusArea && payload.strongestWork);
  }
  if (type === "lab") {
    return Boolean(payload.labName && payload.agenda);
  }
  if (type === "capital") {
    return Boolean(payload.investorName && payload.thesis);
  }
  if (type === "proof") {
    return Boolean(payload.title && (payload.artifactUrl || payload.summary));
  }
  return Boolean(payload.targetName && payload.request);
}

async function problemIdFromPayload(supabase, payload) {
  if (!payload.problemSlug) {
    return null;
  }
  const { data, error } = await supabase
    .from("research_problems")
    .select("id")
    .eq("slug", payload.problemSlug)
    .eq("status", "public")
    .maybeSingle();
  if (error) {
    error.statusCode = 500;
    throw error;
  }
  return data?.id || null;
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
        .from("submissions")
        .select("*, research_problems(slug, title)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(100);
      if (error) {
        error.statusCode = 500;
        throw error;
      }
      return sendJson(res, 200, { user: shapeProfile(user.profile), submissions: data || [] });
    }

    const body = await readJson(req);
    const type = requireAllowed(body.type, TYPES, "");
    if (!type) {
      return sendJson(res, 400, { error: "Choose talent, lab, capital, proof, or interaction" });
    }

    const payload = cleanPayload(type, body.payload || {});
    if (!hasRequired(type, payload)) {
      return sendJson(res, 400, {
        error: "Required fields are missing or confidentiality acknowledgement is unchecked",
      });
    }

    const visibility = requireAllowed(body.visibility, VISIBILITY, "private");
    const sourceUrl =
      payload.sourceUrl ||
      payload.portfolioUrl ||
      payload.website ||
      payload.artifactUrl ||
      payload.contextUrl ||
      null;
    const { data, error } = await supabase
      .from("submissions")
      .insert({
        user_id: user.id,
        type,
        title: titleFor(type, payload),
        payload,
        visibility,
        status: "pending",
        source_url: sourceUrl,
        problem_id: await problemIdFromPayload(supabase, payload),
      })
      .select("*")
      .single();

    if (error) {
      error.statusCode = 500;
      throw error;
    }

    sendJson(res, 201, { submission: data });
  } catch (error) {
    handleError(res, error);
  }
};
