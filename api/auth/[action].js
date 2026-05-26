const { getAnonClient } = require("../../lib/_supabase");
const { cleanText } = require("../../lib/_validation");
const { handleError, methodAllowed, readJson, requireSameOrigin, sendJson } = require("../../lib/_http");

const ROLES = new Set(["talent", "lab", "capital", "scientist"]);

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function authAction(req) {
  const pathname = new URL(req.url, `https://${req.headers.host}`).pathname;
  return pathname.split("/").filter(Boolean).pop();
}

async function login(req, res) {
  if (!methodAllowed(req, res, ["POST"]) || !requireSameOrigin(req, res)) {
    return;
  }

  const body = await readJson(req);
  const { data, error } = await getAnonClient().auth.signInWithPassword({
    email: cleanText(body.email, 240).toLowerCase(),
    password: String(body.password || ""),
  });

  if (error) {
    error.statusCode = error.status || 401;
    throw error;
  }

  sendJson(res, 200, { user: data.user, session: data.session });
}

async function register(req, res) {
  if (!methodAllowed(req, res, ["POST"]) || !requireSameOrigin(req, res)) {
    return;
  }

  const body = await readJson(req);
  const email = cleanText(body.email, 240).toLowerCase();
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
    return sendJson(res, 400, { error: "Choose talent, lab, capital, or scientist" });
  }

  const { data, error } = await getAnonClient().auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        role,
        organization: cleanText(body.organization, 160),
        country: cleanText(body.country, 80),
        headline: cleanText(body.headline, 180),
      },
    },
  });

  if (error) {
    error.statusCode = error.status || 400;
    throw error;
  }

  sendJson(res, 201, {
    user: data.user,
    session: data.session,
    emailConfirmationRequired: Boolean(data.user && !data.session),
  });
}

async function logout(req, res) {
  if (!methodAllowed(req, res, ["POST"]) || !requireSameOrigin(req, res)) {
    return;
  }

  sendJson(res, 200, { ok: true });
}

module.exports = async function handler(req, res) {
  try {
    const action = authAction(req);
    if (action === "login") {
      return await login(req, res);
    }
    if (action === "register") {
      return await register(req, res);
    }
    if (action === "logout") {
      return await logout(req, res);
    }
    return sendJson(res, 404, { error: "Auth action not found" });
  } catch (error) {
    handleError(res, error);
  }
};
