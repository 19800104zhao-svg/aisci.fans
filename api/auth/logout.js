const { clearSessionCookie, hashToken } = require("../_auth");
const { deleteSession } = require("../_db");
const { handleError, methodAllowed, requireSameOrigin, sendJson } = require("../_http");

function sessionToken(req) {
  const cookie = req.headers.cookie || "";
  const match = cookie.match(/(?:^|;\s*)aisci_session=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : "";
}

module.exports = async function handler(req, res) {
  try {
    if (!methodAllowed(req, res, ["POST"]) || !requireSameOrigin(req, res)) {
      return;
    }

    const token = sessionToken(req);
    clearSessionCookie(res);
    if (token) {
      await deleteSession(hashToken(token)).catch(() => {});
    }
    sendJson(res, 200, { ok: true });
  } catch (error) {
    handleError(res, error);
  }
};
