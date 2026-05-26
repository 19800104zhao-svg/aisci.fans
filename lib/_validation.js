function cleanText(value, max = 2000) {
  return String(value || "").trim().slice(0, max);
}

function cleanArray(value, maxItems = 12, maxLength = 500) {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.map((item) => cleanText(item, maxLength)).filter(Boolean).slice(0, maxItems);
}

function cleanUrl(value) {
  const text = cleanText(value, 500);
  try {
    const url = new URL(text);
    return ["http:", "https:"].includes(url.protocol) ? url.toString() : "";
  } catch {
    return "";
  }
}

function slugify(value) {
  return cleanText(value, 180)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

function required(value) {
  return cleanText(value).length > 0;
}

function requireAllowed(value, allowed, fallback = "") {
  const text = cleanText(value, 80);
  return allowed.includes(text) ? text : fallback;
}

module.exports = {
  cleanArray,
  cleanText,
  cleanUrl,
  required,
  requireAllowed,
  slugify,
};
