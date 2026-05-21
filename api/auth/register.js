const { createSession, createUser } = require("../_db");
const {
  createSessionToken,
  hashPassword,
  hashToken,
  normalizeEmail,
  publicUser,
  sessionExpiresAt,
  setSessionCookie,
} = require("../_auth");
const { handleError, methodAllowed, readJson, requireSameOrigin, sendJson } = require("../_http");

const ROLES = new Set(["talent", "lab", "capital"]);

function cleanText(value, max = 160) {
  return String(value || "").trim().slice(0, max);
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

module.exports = async function handler(req, res) {
  try {
    if (!methodAllowed(req, res, ["POST"]) || !requireSameOrigin(req, res)) {
      return;
    }

    const body = await readJson(req);
    const email = normalizeEmail(body.email);
    const password = String(body.password || "");
    const role = cleanText(body.role || "talent", 32);
    const name = cleanText(body.name, 120);

    if (!validateEmail(email)) {
      return sendJson(res, 400, { error: "Enter a valid email address" });
    }
    if (password.length < 10) {
      return sendJson(res, 400, { error: "Password must be at least 10 characters" });
    }
    if (!name) {
      return sendJson(res, 400, { error: "Name is required" });
    }
    if (!ROLES.has(role)) {
      return sendJson(res, 400, { error: "Choose talent, lab, or capital" });
    }

    const user = await createUser({
      email,
      passwordHash: await hashPassword(password),
      name,
      role,
      organization: cleanText(body.organization, 160),
      country: cleanText(body.country, 80),
      headline: cleanText(body.headline, 180),
    });

    const token = createSessionToken();
    await createSession(user.id, hashToken(token), sessionExpiresAt());
    setSessionCookie(req, res, token);
    sendJson(res, 201, { user: publicUser(user) });
  } catch (error) {
    handleError(res, error);
  }
};
