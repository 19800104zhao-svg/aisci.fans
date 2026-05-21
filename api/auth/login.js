const { createSession, findUserByEmail } = require("../_db");
const {
  createSessionToken,
  hashToken,
  normalizeEmail,
  publicUser,
  sessionExpiresAt,
  setSessionCookie,
  verifyPassword,
} = require("../_auth");
const { handleError, methodAllowed, readJson, requireSameOrigin, sendJson } = require("../_http");

module.exports = async function handler(req, res) {
  try {
    if (!methodAllowed(req, res, ["POST"]) || !requireSameOrigin(req, res)) {
      return;
    }

    const body = await readJson(req);
    const email = normalizeEmail(body.email);
    const password = String(body.password || "");
    const user = await findUserByEmail(email);
    const valid = user ? await verifyPassword(password, user.password_hash) : false;

    if (!valid) {
      return sendJson(res, 401, { error: "Invalid email or password" });
    }

    const token = createSessionToken();
    await createSession(user.id, hashToken(token), sessionExpiresAt());
    setSessionCookie(req, res, token);
    sendJson(res, 200, { user: publicUser(user) });
  } catch (error) {
    handleError(res, error);
  }
};
