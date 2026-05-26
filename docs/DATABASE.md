# AISci Supabase Backend

AISci now uses Supabase for the June 1 MVP: Postgres, Auth, OAuth, RLS, and founder/admin review.

## Required Env

```env
SUPABASE_URL="https://YOUR_PROJECT.supabase.co"
SUPABASE_ANON_KEY="YOUR_SUPABASE_ANON_KEY"
SUPABASE_SERVICE_ROLE_KEY="YOUR_SUPABASE_SERVICE_ROLE_KEY"
AISCI_ADMIN_EMAILS="19800104zhao@gmail.com"
CRON_SECRET="long-random-secret"
SEMANTIC_SCHOLAR_API_KEY=""
NCBI_API_KEY=""
```

`SUPABASE_ANON_KEY` is safe for browser Auth. `SUPABASE_SERVICE_ROLE_KEY` must stay server-only in Vercel env vars and must never be committed or exposed to the client.

## Setup

1. Create a Supabase project.
2. Run [supabase/schema.sql](/Users/kenichi/Documents/ai's'ci.fans/supabase/schema.sql) in Supabase SQL Editor.
3. In Supabase Auth, enable email/password.
4. Enable Google and GitHub providers when OAuth credentials are ready.
5. Add the env vars above to Vercel Production and Preview.
6. Redeploy.
7. Register/sign in as `19800104zhao@gmail.com`.
8. Open `/admin/` and verify founder-only access.
9. Trigger `/api/atlas/ingest` with `Authorization: Bearer <CRON_SECRET>` or wait for Vercel Cron.

## Core Tables

- `profiles`: Supabase Auth user profile and role.
- `research_problems`: public/pending scientific problem graph.
- `problem_progress`: source-linked progress updates.
- `papers`: source-linked paper candidates from OpenAlex and Semantic Scholar.
- `scientists`: claimable scientist profiles.
- `problem_scientists`: problem/scientist relationship graph.
- `follows`: user follows for research problems.
- `submissions`: talent, lab, capital, proof, and interaction submissions.
- `problem_discussions`: problem-specific discussion posts, source notes, questions, and proof updates.
- `claim_requests`: scientist profile claim evidence.
- `admin_reviews`: review audit trail.
- `flags`: future content safety queue.
- `ingestion_runs` and `ingestion_logs`: Atlas ingestion observability.

## Privacy Model

- Public users can read only `status = 'public'` problem, progress, paper, and scientist records.
- User submissions, problem discussions, and claims are private/pending by default.
- Users can read their own follows, submissions, discussions, and claims.
- Founder/admin can review all data through `/admin/`.
- Service role is used only inside Vercel API routes.

## RLS Notes

The schema enables RLS on every table. Direct browser access is intentionally limited:

- Users cannot directly set `profiles.is_admin`.
- Users cannot directly publish submissions or problem discussions.
- Claim requests must start as `pending`.
- Public graph reads require approved `public` status.

## Atlas Ingestion

Vercel Cron calls:

```text
GET /api/atlas/ingest
Authorization: Bearer <CRON_SECRET>
```

The job fetches at least OpenAlex and Semantic Scholar. It writes papers, scientists, problem relationships, and logs as `pending`. Nothing imported by Atlas becomes public until founder/admin approval.
