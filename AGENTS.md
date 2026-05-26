# AGENTS.md

This file is the operating manual for agents working on AISci.fans. Follow it before changing code, content, deployments, data, or automations.

## Project

AISci.fans is being built as an AI-native global operating system for scientific research.

Current stage: MVP / pre-launch. The live site exists, but the product is still missing production database activation, real research-problem data ingestion, scientist profile claiming, admin review workflows, and reliable growth loops.

Public launch target: 2026-07-21.

Primary users:

- Young scientific talent who need proof-of-work based discovery instead of credential-only filtering.
- Principal investigators, labs, and expert operators who want to form virtual research labs.
- VCs, angels, and company builders looking for interdisciplinary science commercialization opportunities.
- The founder/operator using Atlas to improve AISci as a self-evolving product system.

Core uncertainty:

- Whether AISci can turn public scientific signals, user-submitted proof, lab agendas, and capital theses into a trusted research graph that produces better matching than existing institutions.
- Whether top researchers, young talent, and capital partners will submit enough high-quality structured data to make the graph valuable.
- Whether the original June 1 MVP baseline can be turned into a credible public launch by July 21 with a curated problem graph before full automation and complete source coverage exist.
- Whether Atlas can reliably find daily product/science/growth improvements without generating noise.

Product north star:

- Map frontier problems, bottlenecks, researchers, young talent, data, labs, and capital.
- Discover ability through public proof-of-work, not credentials alone.
- Help top researchers form virtual labs and help young talent learn by contributing.
- Surface venture-scale commercialization opportunities from interdisciplinary science.
- Keep all important work legible to AI through structured records, source-linked memory, evals, and operating docs.

Minimum acceptable MVP baseline (originally scoped for June 1, now serving the July 21 public launch):

- Users can query the world's most important research problems.
- Each problem shows current progress, related papers, related scientists, and credible source links.
- Young research enthusiasts can register, follow problems, and submit their own research outputs.
- Users can interact through structured submissions/comments/messages that are reviewable by admins before public display.
- Scientist profile pages exist and can be claimed through a verification workflow.
- Founder/admin can view all users, submissions, problem discussions, claimed profiles, follows, and flagged content.

## Commands

Runtime requirements:

- Node.js `>=20`.
- Production API/database path expects Vercel Functions and Supabase env vars.

Common commands:

```bash
# Generate second-level and third-level static pages plus sitemap.
node tools/build-pages.mjs

# Vendor the browser Supabase client after npm install.
npm run vendor:supabase

# Run local static site server.
npm run dev
npm start
```

Checks to run after relevant changes:

```bash
# JavaScript syntax checks.
node --check app.js
node --check portal.js
node --check research.js
node --check scientist.js
node --check admin.js
find api -type f -name '*.js' -maxdepth 3 -print0 | xargs -0 -n1 node --check
node --check tools/build-pages.mjs
node --check tools/static-server.mjs
node --check tools/vendor-supabase.mjs

# Regenerate generated pages when tools/build-pages.mjs changes.
node tools/build-pages.mjs

# Git whitespace/conflict check.
git diff --check
```

Manual/browser checks:

- Open `/`, `/problems/`, one problem detail page, `/scientists/`, `/login/`, `/dashboard/`, `/intake/?type=talent|lab|capital|proof`, and `/admin/`.
- Check desktop and mobile widths for horizontal overflow.
- Check browser console for JavaScript errors.
- If production deploy is intended, verify the same representative routes on `https://aisci.fans/`.

## Architecture

The project is mostly a static site with Vercel serverless API routes.

Main directories and files:

- `index.html`: homepage with multilingual copy, search/filter UI, and the interactive problem detail panel.
- `app.js`: homepage interactions, i18n text, problem data, filtering, graph rendering, and homepage navigation behavior.
- `styles.css`: shared UI system for homepage, generated product pages, auth/intake/dashboard pages.
- `tools/build-pages.mjs`: static page generator for the product workspace pages and `sitemap.xml`.
- `problems/`, `talent/`, `labs/`, `capital/`, `atlas/`: generated second-level and third-level public product pages.
- `scientists/`: dynamic scientist profile and claim page shell.
- `login/`, `dashboard/`, `intake/`, `admin/`: account, personal homepage, structured submission UI, and founder/admin review UI.
- `portal.js`, `research.js`, `scientist.js`, `admin.js`: frontend logic for Supabase Auth, problem graph, profile claims, and admin review.
- `vendor/supabase.js`: vendored Supabase browser client copied from `@supabase/supabase-js`.
- `api/`: Vercel Functions for Supabase Auth config, profile, problems, follows, submissions, discussions, claims, admin review, and Atlas ingestion.
- `api/_supabase.js`: server-only Supabase clients, bearer-token verification, profile sync, and admin checks.
- `api/_http.js`: JSON parsing, same-origin checks, error shaping, and response headers.
- `supabase/schema.sql`: Supabase schema, seed problems, indexes, and RLS policies.
- `docs/DATABASE.md`: production database setup and schema notes.
- `.env.example`: expected environment variables.
- `vercel.json` and `_headers`: production security headers.

Data flow:

1. Public visitors browse static pages.
2. Users register or sign in through `/login/` with Supabase email/password, Google, or GitHub.
3. Browser requests private APIs with a Supabase bearer token.
4. Vercel APIs verify the token and use the server-only service role for private/admin operations.
5. `/intake/` collects `talent`, `lab`, `capital`, or `proof` payloads and stores them as private/pending.
6. `/dashboard/` displays profile, submissions, follows, and claim requests.
7. `/admin/` lets founder/admin review submissions, problem discussions, claims, Atlas candidates, flags, and ingestion logs.
8. Vercel Cron calls `/api/atlas/ingest`, which stores source-linked OpenAlex/Semantic Scholar candidates as pending.

External services:

- GitHub repo: `19800104zhao-svg/aisci.fans`.
- Vercel project: `aisci-fans`.
- Production domain: `https://aisci.fans/`.
- Vercel Web Analytics: source for traffic reports.
- Supabase/Postgres is the June 1 MVP backend because it combines Postgres, Auth, OAuth providers, RLS, and admin data inspection.
- OpenAlex and Semantic Scholar are the first Atlas ingestion sources; PubMed/NCBI, arXiv, ORCID, and ROR are next connectors.

## Safety

Do not do these without explicit user approval:

- Create paid resources, upgrade plans, or add marketplace services that may create billing.
- Add or rotate production secrets, OAuth credentials, database credentials, DNS records, or permissions.
- Delete, truncate, migrate destructively, or manually edit production data.
- Send emails, notifications, investor messages, user outreach, or external submissions.
- Change GitHub repository visibility, collaborators, deploy keys, branch protections, or permissions.
- Transfer domains, alter registrar ownership, or make irreversible DNS changes.
- Run destructive git commands such as `git reset --hard` or `git checkout --` against user work.

Content boundaries:

- Do not prioritize political content or politically sensitive positioning.
- Do not build workflows that create legal exposure without explicit review, including regulated medical advice, dangerous biosecurity instructions, sanctions/export-control sensitive workflows, or user claims that require formal legal/compliance handling.
- Allow users to submit broad information, but warn them clearly not to submit trade secrets, confidential third-party data, unpublished sensitive data, or content they do not have rights to share.

Deployment rule:

- Pushing to `main` triggers Vercel production deployment. Only push when the user asked for the change to go live, or when the current task clearly requires production update and checks have passed.
- If a change only affects internal docs or planning, do not push/deploy unless asked.

Data/privacy rules:

- Never expose secrets in logs, docs, commits, or screenshots.
- Do not invent analytics, user, database, or business metrics.
- If Vercel Analytics or database data is inaccessible, state the exact missing credential/session/env var.
- Treat user-submitted talent/lab/capital/proof information as private until explicit publication rules exist.
- Default all user submissions, claimed profiles, and scientist interactions to private or pending review until an admin/publication policy is implemented.

## Workflow

Before changing code, read the relevant files:

- Public homepage or navigation: `index.html`, `app.js`, `styles.css`.
- Generated pages: `tools/build-pages.mjs`, then regenerate with `node tools/build-pages.mjs`.
- Auth/intake/dashboard/admin UI: `login/index.html`, `dashboard/index.html`, `intake/index.html`, `admin/index.html`, `portal.js`, `admin.js`, `styles.css`.
- Problem/scientist graph UI: `tools/build-pages.mjs`, `research.js`, `scientists/index.html`, `scientist.js`.
- API/database/auth: `api/_http.js`, `api/_supabase.js`, `api/_validation.js`, the relevant `api/**` route, `supabase/schema.sql`, and `docs/DATABASE.md`.
- SEO/security headers: `sitemap.xml`, `robots.txt`, `vercel.json`, `_headers`.

After changing code:

- Run the syntax and generation checks listed in `Commands`.
- Run a local browser check for the changed route.
- Check responsive behavior if UI changed.
- Check API behavior with both expected and invalid inputs if API changed.
- If production was deployed, verify production routes and API status after Vercel finishes.

Definition of done:

- Requested outcome is implemented.
- Relevant checks pass.
- Generated files are updated when generator data changes.
- Production is verified when a live change was intended.
- Any blocker is explicit, with the missing credential, permission, or decision named.
- Any repeated friction is classified and turned into a small doc, script, check, schema, or automation improvement when practical.

## AI-Native

AISci should be treated as a self-improving company OS, not a static website.

Existing or intended agents:

- Atlas Daily Product Scout: scans products, papers, patents, labs, startups, capital signals, and AISci product gaps.
- Atlas Traffic Reporter: reads Vercel Web Analytics and reports visitors, page views, referrers, top pages, countries/devices, and one daily growth action.
- Intake Router: future agent that classifies talent/lab/capital submissions and routes them to problems, labs, mentors, or investor workflows.
- Claim Verification Agent: future agent that checks scientist profile claim evidence before founder/admin review.
- Literature Mapper: future agent that maps papers, authors, institutions, datasets, and progress updates to research problems with source trails.
- Quality Monitor: future agent that inspects failed queries, broken funnels, missing tools, weak prompts, missing schemas, and code quality gaps.

Agent failure taxonomy:

- Missing deterministic tool: a script, parser, checker, scraper, validator, or CLI step is missing.
- Missing data structure: schema, dataset, index, source list, taxonomy, or view is unclear.
- Missing skill/protocol: repeatable workflow, checklist, prompt, or `AGENTS.md` rule is missing.
- Prompt weakness: search/query/question framing is too broad or not evidence-seeking.
- Product ambiguity: target user, workflow, success metric, or UX is unclear.
- Code quality gap: broken responsive behavior, missing test, accessibility issue, security gap, or manual repeated step.
- External blocker: credential, paid service, founder decision, legal/compliance issue, unavailable source.

Feedback loops to preserve:

- Vercel Analytics -> daily traffic report -> SEO/product action.
- Intake submissions -> structured database -> matching/review/admin workflows.
- Atlas product research -> 24-72 hour backlog -> implemented changes -> verification.
- Failed agent work -> root-cause classification -> durable improvement in docs/scripts/evals/schema.

Eval expectations:

- Do not rely only on generated copy quality. Verify routes, forms, API behavior, security headers, and production status.
- For data/reporting tasks, separate facts, source-backed evidence, and inference.
- For AI-generated product changes, check whether the change improves a real user workflow: browse, register, submit, review, match, or measure.

Daily Atlas brief standard:

- Product references AISci can learn from.
- Frontier research problems and bottlenecks worth adding.
- Researchers, labs, young talent, and proof-of-work signals.
- Commercialization and VC-relevant opportunities.
- Product/design/data improvements for AISci.fans.
- Prioritized 24-72 hour implementation backlog.
- Launch readiness against the 2026-07-21 goal.
- Self-improvement log: weak query, root cause, and exact system change needed before the same failure repeats.
