const crypto = require("node:crypto");

let sqlClient;
let schemaReady;

function databaseError() {
  const error = new Error("Database is not configured");
  error.statusCode = 503;
  error.code = "DATABASE_NOT_CONFIGURED";
  return error;
}

async function getSql() {
  if (!process.env.DATABASE_URL) {
    throw databaseError();
  }
  if (!sqlClient) {
    const { neon } = await import("@neondatabase/serverless");
    sqlClient = neon(process.env.DATABASE_URL);
  }
  return sqlClient;
}

function id(prefix) {
  return `${prefix}_${crypto.randomUUID()}`;
}

async function ensureSchema() {
  if (schemaReady) {
    return schemaReady;
  }

  schemaReady = (async () => {
    const sql = await getSql();
    await sql`
      CREATE TABLE IF NOT EXISTS aisci_users (
        id text PRIMARY KEY,
        email text UNIQUE NOT NULL,
        password_hash text NOT NULL,
        name text NOT NULL,
        role text NOT NULL,
        organization text,
        country text,
        headline text,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      )
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS aisci_sessions (
        id text PRIMARY KEY,
        user_id text NOT NULL REFERENCES aisci_users(id) ON DELETE CASCADE,
        token_hash text UNIQUE NOT NULL,
        expires_at timestamptz NOT NULL,
        created_at timestamptz NOT NULL DEFAULT now()
      )
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS aisci_profiles (
        user_id text PRIMARY KEY REFERENCES aisci_users(id) ON DELETE CASCADE,
        profile_type text NOT NULL,
        focus_area text,
        bio text,
        website text,
        public_links jsonb NOT NULL DEFAULT '[]'::jsonb,
        proof_links jsonb NOT NULL DEFAULT '[]'::jsonb,
        updated_at timestamptz NOT NULL DEFAULT now()
      )
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS aisci_submissions (
        id text PRIMARY KEY,
        user_id text NOT NULL REFERENCES aisci_users(id) ON DELETE CASCADE,
        type text NOT NULL,
        status text NOT NULL DEFAULT 'new',
        payload jsonb NOT NULL,
        created_at timestamptz NOT NULL DEFAULT now()
      )
    `;
    await sql`CREATE INDEX IF NOT EXISTS aisci_submissions_user_created_idx ON aisci_submissions(user_id, created_at DESC)`;
    await sql`CREATE INDEX IF NOT EXISTS aisci_submissions_type_status_idx ON aisci_submissions(type, status)`;
    await sql`CREATE INDEX IF NOT EXISTS aisci_sessions_expiry_idx ON aisci_sessions(expires_at)`;
  })();

  return schemaReady;
}

async function createUser(user) {
  await ensureSchema();
  const sql = await getSql();
  try {
    const rows = await sql`
      INSERT INTO aisci_users (
        id, email, password_hash, name, role, organization, country, headline
      ) VALUES (
        ${id("usr")},
        ${user.email},
        ${user.passwordHash},
        ${user.name},
        ${user.role},
        ${user.organization || null},
        ${user.country || null},
        ${user.headline || null}
      )
      RETURNING id, email, name, role, organization, country, headline, created_at
    `;
    return rows[0];
  } catch (error) {
    if (error.code === "23505") {
      error.statusCode = 409;
      error.message = "An account with this email already exists";
    }
    throw error;
  }
}

async function findUserByEmail(email) {
  await ensureSchema();
  const sql = await getSql();
  const rows = await sql`
    SELECT id, email, password_hash, name, role, organization, country, headline, created_at
    FROM aisci_users
    WHERE email = ${email}
    LIMIT 1
  `;
  return rows[0] || null;
}

async function createSession(userId, tokenHash, expiresAt) {
  await ensureSchema();
  const sql = await getSql();
  await sql`
    INSERT INTO aisci_sessions (id, user_id, token_hash, expires_at)
    VALUES (${id("ses")}, ${userId}, ${tokenHash}, ${expiresAt.toISOString()})
  `;
}

async function findUserBySession(tokenHash) {
  await ensureSchema();
  const sql = await getSql();
  const rows = await sql`
    SELECT u.id, u.email, u.name, u.role, u.organization, u.country, u.headline, u.created_at
    FROM aisci_sessions s
    JOIN aisci_users u ON u.id = s.user_id
    WHERE s.token_hash = ${tokenHash}
      AND s.expires_at > now()
    LIMIT 1
  `;
  return rows[0] || null;
}

async function deleteSession(tokenHash) {
  await ensureSchema();
  const sql = await getSql();
  await sql`DELETE FROM aisci_sessions WHERE token_hash = ${tokenHash}`;
}

async function upsertProfile(userId, profile) {
  await ensureSchema();
  const sql = await getSql();
  const rows = await sql`
    INSERT INTO aisci_profiles (
      user_id, profile_type, focus_area, bio, website, public_links, proof_links, updated_at
    ) VALUES (
      ${userId},
      ${profile.profileType},
      ${profile.focusArea || null},
      ${profile.bio || null},
      ${profile.website || null},
      ${JSON.stringify(profile.publicLinks || [])}::jsonb,
      ${JSON.stringify(profile.proofLinks || [])}::jsonb,
      now()
    )
    ON CONFLICT (user_id) DO UPDATE SET
      profile_type = EXCLUDED.profile_type,
      focus_area = EXCLUDED.focus_area,
      bio = EXCLUDED.bio,
      website = EXCLUDED.website,
      public_links = EXCLUDED.public_links,
      proof_links = EXCLUDED.proof_links,
      updated_at = now()
    RETURNING user_id, profile_type, focus_area, bio, website, public_links, proof_links, updated_at
  `;
  return rows[0];
}

async function getProfile(userId) {
  await ensureSchema();
  const sql = await getSql();
  const rows = await sql`
    SELECT user_id, profile_type, focus_area, bio, website, public_links, proof_links, updated_at
    FROM aisci_profiles
    WHERE user_id = ${userId}
    LIMIT 1
  `;
  return rows[0] || null;
}

async function createSubmission(userId, type, payload) {
  await ensureSchema();
  const sql = await getSql();
  const rows = await sql`
    INSERT INTO aisci_submissions (id, user_id, type, payload)
    VALUES (${id("sub")}, ${userId}, ${type}, ${JSON.stringify(payload)}::jsonb)
    RETURNING id, user_id, type, status, payload, created_at
  `;
  return rows[0];
}

async function listUserSubmissions(userId) {
  await ensureSchema();
  const sql = await getSql();
  return sql`
    SELECT id, type, status, payload, created_at
    FROM aisci_submissions
    WHERE user_id = ${userId}
    ORDER BY created_at DESC
    LIMIT 50
  `;
}

module.exports = {
  createSession,
  createSubmission,
  createUser,
  deleteSession,
  findUserByEmail,
  findUserBySession,
  getProfile,
  listUserSubmissions,
  upsertProfile,
};
