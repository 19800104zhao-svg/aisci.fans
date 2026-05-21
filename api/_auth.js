const crypto = require("node:crypto");
const { findUserBySession } = require("./_db");

const COOKIE_NAME = "aisci_session";
const SESSION_DAYS = 30;

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function parseCookies(req) {
  const header = req.headers.cookie || "";
  return Object.fromEntries(
    header
      .split(";")
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => {
        const index = part.indexOf("=");
        return [part.slice(0, index), decodeURIComponent(part.slice(index + 1))];
      }),
  );
}

function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function createSessionToken() {
  return crypto.randomBytes(32).toString("base64url");
}

function sessionExpiresAt() {
  return new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
}

function cookieOptions(req) {
  const secure = req.headers["x-forwarded-proto"] === "https" || process.env.VERCEL === "1";
  return [
    "HttpOnly",
    "Path=/",
    "SameSite=Lax",
    `Max-Age=${SESSION_DAYS * 24 * 60 * 60}`,
    secure ? "Secure" : "",
  ]
    .filter(Boolean)
    .join("; ");
}

function setSessionCookie(req, res, token) {
  res.setHeader("Set-Cookie", `${COOKIE_NAME}=${encodeURIComponent(token)}; ${cookieOptions(req)}`);
}

function clearSessionCookie(res) {
  res.setHeader("Set-Cookie", `${COOKIE_NAME}=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0`);
}

async function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const key = await new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, 64, { N: 16384, r: 8, p: 1 }, (error, derivedKey) => {
      if (error) reject(error);
      else resolve(derivedKey);
    });
  });
  return `scrypt:${salt}:${key.toString("hex")}`;
}

async function verifyPassword(password, storedHash) {
  const [scheme, salt, hash] = String(storedHash || "").split(":");
  if (scheme !== "scrypt" || !salt || !hash) {
    return false;
  }

  const key = await new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, 64, { N: 16384, r: 8, p: 1 }, (error, derivedKey) => {
      if (error) reject(error);
      else resolve(derivedKey);
    });
  });

  const expected = Buffer.from(hash, "hex");
  return expected.length === key.length && crypto.timingSafeEqual(expected, key);
}

async function getSessionUser(req) {
  const token = parseCookies(req)[COOKIE_NAME];
  if (!token) {
    return null;
  }
  return findUserBySession(hashToken(token));
}

function publicUser(user) {
  if (!user) {
    return null;
  }
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    organization: user.organization,
    country: user.country,
    headline: user.headline,
    createdAt: user.created_at,
  };
}

module.exports = {
  clearSessionCookie,
  createSessionToken,
  getSessionUser,
  hashPassword,
  hashToken,
  normalizeEmail,
  publicUser,
  sessionExpiresAt,
  setSessionCookie,
  verifyPassword,
};
