const { getSessionUser, publicUser } = require("../_auth");
const { createSubmission, listUserSubmissions } = require("../_db");
const { handleError, methodAllowed, readJson, requireSameOrigin, sendJson } = require("../_http");

const TYPES = new Set(["talent", "lab", "capital"]);

function cleanText(value, max = 2000) {
  return String(value || "").trim().slice(0, max);
}

function cleanArray(value, maxItems = 12) {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.map((item) => cleanText(item, 500)).filter(Boolean).slice(0, maxItems);
}

function cleanUrl(value) {
  const text = cleanText(value, 300);
  return text.startsWith("http://") || text.startsWith("https://") ? text : "";
}

function cleanPayload(type, payload = {}) {
  if (type === "talent") {
    return {
      focusArea: cleanText(payload.focusArea, 180),
      location: cleanText(payload.location, 120),
      stage: cleanText(payload.stage, 80),
      proofLinks: cleanArray(payload.proofLinks),
      skills: cleanArray(payload.skills),
      strongestWork: cleanText(payload.strongestWork),
      mentorAsk: cleanText(payload.mentorAsk),
      portfolioUrl: cleanUrl(payload.portfolioUrl),
    };
  }

  if (type === "lab") {
    return {
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

  return {
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

function hasRequired(type, payload) {
  if (type === "talent") {
    return Boolean(payload.focusArea && payload.strongestWork);
  }
  if (type === "lab") {
    return Boolean(payload.labName && payload.agenda);
  }
  return Boolean(payload.investorName && payload.thesis);
}

module.exports = async function handler(req, res) {
  try {
    if (!methodAllowed(req, res, ["GET", "POST"])) {
      return;
    }
    if (req.method === "POST" && !requireSameOrigin(req, res)) {
      return;
    }

    const user = await getSessionUser(req);
    if (!user) {
      return sendJson(res, 401, { error: "Sign in required" });
    }

    if (req.method === "GET") {
      return sendJson(res, 200, {
        user: publicUser(user),
        submissions: await listUserSubmissions(user.id),
      });
    }

    const body = await readJson(req);
    const type = cleanText(body.type, 32);
    if (!TYPES.has(type)) {
      return sendJson(res, 400, { error: "Choose talent, lab, or capital" });
    }

    const payload = cleanPayload(type, body.payload || {});
    if (!hasRequired(type, payload)) {
      return sendJson(res, 400, { error: "Required fields are missing" });
    }

    const submission = await createSubmission(user.id, type, payload);
    sendJson(res, 201, { submission });
  } catch (error) {
    handleError(res, error);
  }
};
