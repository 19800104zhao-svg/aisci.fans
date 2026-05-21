const MAX_BODY_BYTES = 64 * 1024;

function setSecurityHeaders(res) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("X-Content-Type-Options", "nosniff");
}

function sendJson(res, statusCode, payload) {
  setSecurityHeaders(res);
  res.statusCode = statusCode;
  res.end(JSON.stringify(payload));
}

function methodAllowed(req, res, methods) {
  if (methods.includes(req.method)) {
    return true;
  }
  res.setHeader("Allow", methods.join(", "));
  sendJson(res, 405, { error: "Method not allowed" });
  return false;
}

function sameOrigin(req) {
  const origin = req.headers.origin;
  const host = req.headers.host;
  if (!origin || !host) {
    return true;
  }

  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

function requireSameOrigin(req, res) {
  if (sameOrigin(req)) {
    return true;
  }
  sendJson(res, 403, { error: "Cross-origin requests are not allowed" });
  return false;
}

async function readJson(req) {
  let body = "";
  for await (const chunk of req) {
    body += chunk;
    if (body.length > MAX_BODY_BYTES) {
      const error = new Error("Request body is too large");
      error.statusCode = 413;
      throw error;
    }
  }

  if (!body.trim()) {
    return {};
  }

  try {
    return JSON.parse(body);
  } catch {
    const error = new Error("Invalid JSON body");
    error.statusCode = 400;
    throw error;
  }
}

function handleError(res, error) {
  const statusCode = error.statusCode || 500;
  const message = statusCode >= 500 ? "Server error" : error.message;
  const payload = { error: message };
  if (error.code === "DATABASE_NOT_CONFIGURED") {
    payload.code = error.code;
    payload.error = "Database is not configured yet";
    payload.message = "Add DATABASE_URL in Vercel to enable registration and submissions.";
  }
  sendJson(res, statusCode, payload);
}

module.exports = {
  handleError,
  methodAllowed,
  readJson,
  requireSameOrigin,
  sendJson,
};
