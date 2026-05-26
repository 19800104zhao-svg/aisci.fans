const { getPublicSupabaseConfig } = require("../lib/_supabase");
const { handleError, methodAllowed, sendJson } = require("../lib/_http");

module.exports = async function handler(req, res) {
  try {
    if (!methodAllowed(req, res, ["GET"])) {
      return;
    }

    sendJson(res, 200, {
      supabase: getPublicSupabaseConfig(),
      auth: {
        providers: ["google", "github"],
        appleAvailable: false,
      },
    });
  } catch (error) {
    handleError(res, error);
  }
};
