const { createClient } = require("@supabase/supabase-js");

let adminClient;
let anonClient;

function configError(message = "Supabase is not configured") {
  const error = new Error(message);
  error.statusCode = 503;
  error.code = "SUPABASE_NOT_CONFIGURED";
  return error;
}

function authError(message = "Sign in required") {
  const error = new Error(message);
  error.statusCode = 401;
  error.code = "AUTH_REQUIRED";
  return error;
}

function adminError(message = "Admin access required") {
  const error = new Error(message);
  error.statusCode = 403;
  error.code = "ADMIN_REQUIRED";
  return error;
}

function getPublicSupabaseConfig() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) {
    throw configError("Add SUPABASE_URL and SUPABASE_ANON_KEY to enable Supabase Auth");
  }
  return { supabaseUrl, supabaseAnonKey };
}

function getServiceSupabaseConfig() {
  const { supabaseUrl } = getPublicSupabaseConfig();
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseServiceRoleKey) {
    throw configError("Add SUPABASE_SERVICE_ROLE_KEY to enable server-side AISci data APIs");
  }
  return { supabaseUrl, supabaseServiceRoleKey };
}

function getAnonClient() {
  if (!anonClient) {
    const { supabaseUrl, supabaseAnonKey } = getPublicSupabaseConfig();
    anonClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }
  return anonClient;
}

function getAdminClient() {
  if (!adminClient) {
    const { supabaseUrl, supabaseServiceRoleKey } = getServiceSupabaseConfig();
    adminClient = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }
  return adminClient;
}

function getAdminEmails() {
  return String(process.env.AISCI_ADMIN_EMAILS || "19800104zhao@gmail.com")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

function getBearerToken(req) {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(/\s+/);
  return /^bearer$/i.test(scheme) && token ? token : "";
}

async function ensureProfile(authUser) {
  const supabase = getAdminClient();
  const email = String(authUser.email || "").toLowerCase();
  const metadata = authUser.user_metadata || {};
  const adminEmails = getAdminEmails();
  const { data: existing, error: existingError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", authUser.id)
    .maybeSingle();
  if (existingError) {
    existingError.statusCode = 500;
    throw existingError;
  }

  const displayName =
    metadata.name ||
    metadata.full_name ||
    metadata.display_name ||
    existing?.display_name ||
    email.split("@")[0] ||
    "AISci member";
  let role = existing?.role || "talent";
  if (["talent", "lab", "capital", "scientist"].includes(metadata.role) && !existing?.role) {
    role = metadata.role;
  }
  if (adminEmails.includes(email)) {
    role = "admin";
  }

  const payload = {
    id: authUser.id,
    email,
    display_name: displayName,
    role,
    organization: existing?.organization || metadata.organization || null,
    country: existing?.country || metadata.country || null,
    headline: existing?.headline || metadata.headline || null,
    is_admin: Boolean(existing?.is_admin) || adminEmails.includes(email) || authUser.app_metadata?.role === "admin",
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("profiles")
    .upsert(payload, { onConflict: "id" })
    .select("*")
    .single();

  if (error) {
    error.statusCode = 500;
    throw error;
  }

  return data;
}

async function getCurrentUser(req) {
  const token = getBearerToken(req);
  if (!token) {
    return null;
  }

  const { data, error } = await getAnonClient().auth.getUser(token);
  if (error || !data?.user) {
    return null;
  }

  const profile = await ensureProfile(data.user);
  return {
    auth: data.user,
    profile,
    token,
    id: data.user.id,
    email: String(data.user.email || "").toLowerCase(),
    isAdmin:
      Boolean(profile?.is_admin) ||
      getAdminEmails().includes(String(data.user.email || "").toLowerCase()) ||
      data.user.app_metadata?.role === "admin",
  };
}

async function requireUser(req) {
  const user = await getCurrentUser(req);
  if (!user) {
    throw authError();
  }
  return user;
}

async function requireAdmin(req) {
  const user = await requireUser(req);
  if (!user.isAdmin) {
    throw adminError();
  }
  return user;
}

function shapeProfile(profile) {
  if (!profile) {
    return null;
  }
  return {
    id: profile.id,
    email: profile.email,
    name: profile.display_name,
    role: profile.role,
    organization: profile.organization,
    country: profile.country,
    headline: profile.headline,
    profileType: profile.profile_type,
    focusArea: profile.focus_area,
    bio: profile.bio,
    website: profile.website,
    publicLinks: profile.public_links || [],
    proofLinks: profile.proof_links || [],
    isAdmin: Boolean(profile.is_admin),
    createdAt: profile.created_at,
    updatedAt: profile.updated_at,
  };
}

module.exports = {
  adminError,
  authError,
  configError,
  getAdminClient,
  getAdminEmails,
  getAnonClient,
  getCurrentUser,
  getPublicSupabaseConfig,
  requireAdmin,
  requireUser,
  shapeProfile,
};
