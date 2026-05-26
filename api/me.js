const { getAdminClient, requireUser, shapeProfile } = require("../lib/_supabase");
const { cleanArray, cleanText, cleanUrl, requireAllowed } = require("../lib/_validation");
const { handleError, methodAllowed, readJson, requireSameOrigin, sendJson } = require("../lib/_http");

const PROFILE_TYPES = ["talent", "lab", "capital", "scientist", "admin"];

module.exports = async function handler(req, res) {
  try {
    if (!methodAllowed(req, res, ["GET", "PUT"])) {
      return;
    }
    if (req.method === "PUT" && !requireSameOrigin(req, res)) {
      return;
    }

    const user = await requireUser(req);
    const supabase = getAdminClient();

    if (req.method === "GET") {
      return sendJson(res, 200, { user: shapeProfile(user.profile), profile: shapeProfile(user.profile) });
    }

    const body = await readJson(req);
    const allowedProfileTypes = user.isAdmin ? PROFILE_TYPES : ["talent", "lab", "capital", "scientist"];
    const updates = {
      display_name: cleanText(body.name || body.displayName || user.profile.display_name, 120),
      role: requireAllowed(body.role || user.profile.role, allowedProfileTypes, user.profile.role || "talent"),
      organization: cleanText(body.organization, 160) || null,
      country: cleanText(body.country, 80) || null,
      headline: cleanText(body.headline, 180) || null,
      profile_type: requireAllowed(body.profileType || body.role || user.profile.profile_type, allowedProfileTypes, null),
      focus_area: cleanText(body.focusArea, 180) || null,
      bio: cleanText(body.bio, 1600) || null,
      website: cleanUrl(body.website) || null,
      public_links: cleanArray(body.publicLinks).map((url) => ({ url })),
      proof_links: cleanArray(body.proofLinks).map((url) => ({ url })),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", user.id)
      .select("*")
      .single();

    if (error) {
      error.statusCode = 500;
      throw error;
    }

    sendJson(res, 200, { user: shapeProfile(data), profile: shapeProfile(data) });
  } catch (error) {
    handleError(res, error);
  }
};
