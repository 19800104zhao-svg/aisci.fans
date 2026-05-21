const { getSessionUser, publicUser } = require("./_auth");
const { getProfile, upsertProfile } = require("./_db");
const { handleError, methodAllowed, readJson, requireSameOrigin, sendJson } = require("./_http");

function cleanText(value, max = 1200) {
  return String(value || "").trim().slice(0, max);
}

function cleanLinks(value) {
  if (!Array.isArray(value)) {
    return [];
  }
  return value
    .map((item) => ({
      label: cleanText(item.label, 80),
      url: cleanText(item.url, 300),
    }))
    .filter((item) => item.url.startsWith("http://") || item.url.startsWith("https://"))
    .slice(0, 12);
}

module.exports = async function handler(req, res) {
  try {
    if (!methodAllowed(req, res, ["GET", "PUT"])) {
      return;
    }
    if (req.method === "PUT" && !requireSameOrigin(req, res)) {
      return;
    }

    const user = await getSessionUser(req);
    if (!user) {
      return sendJson(res, 401, { error: "Sign in required" });
    }

    if (req.method === "GET") {
      return sendJson(res, 200, { user: publicUser(user), profile: await getProfile(user.id) });
    }

    const body = await readJson(req);
    const profile = await upsertProfile(user.id, {
      profileType: cleanText(body.profileType || user.role, 32),
      focusArea: cleanText(body.focusArea, 180),
      bio: cleanText(body.bio, 1600),
      website: cleanText(body.website, 300),
      publicLinks: cleanLinks(body.publicLinks),
      proofLinks: cleanLinks(body.proofLinks),
    });
    sendJson(res, 200, { user: publicUser(user), profile });
  } catch (error) {
    handleError(res, error);
  }
};
