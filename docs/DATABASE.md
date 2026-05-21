# AISci Backend Database

AISci uses Postgres for account, profile, and intake data. On Vercel, the intended production setup is Neon Postgres through the Vercel Marketplace.

## Required Environment Variable

```env
DATABASE_URL="postgres://USER:PASSWORD@HOST/DB?sslmode=require"
```

The API routes create the tables automatically on first use:

- `aisci_users`: registered users across talent, lab, and capital roles.
- `aisci_sessions`: hashed HTTP-only login sessions.
- `aisci_profiles`: editable personal homepage/profile metadata.
- `aisci_submissions`: talent, lab, and capital intake payloads.

## Security Notes

- Passwords are hashed with Node `crypto.scrypt`; plaintext passwords are never stored.
- Session tokens are stored in the browser as HTTP-only cookies and in the database only as SHA-256 hashes.
- Mutating API routes require same-origin requests.
- API responses are `no-store` and do not expose password hashes or raw session tokens.
- Production registration and submissions stay disabled until `DATABASE_URL` is configured.

## First Production Setup

1. Add a Neon Postgres integration in the Vercel project.
2. Confirm `DATABASE_URL` is available to Production and Preview.
3. Redeploy the project.
4. Register the first user at `/login/`.
5. Submit one test intake at `/intake/` and verify it appears on `/dashboard/`.
