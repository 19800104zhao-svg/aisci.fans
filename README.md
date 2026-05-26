# AISci.fans

AISci.fans is an AI-native science network for organizing frontier problems, exceptional researchers, young talent, virtual labs, and venture-scale commercialization opportunities.

## Local Development

```bash
npm install
npm run vendor:supabase
npm run build:pages
npm run dev
```

Open `http://localhost:4173`.

The static pages work without Supabase. Auth, follow, submission, discussion, claim, admin, and ingestion APIs require the Supabase env vars in `.env.example`.

## Deploy

This is a static site plus Vercel Functions. Deploy the repository root to Vercel for the full MVP.

For production, configure Supabase, run `supabase/schema.sql`, add Vercel env vars, and verify `/login/`, `/dashboard/`, `/intake/`, `/admin/`, `/api/problems`, `/api/discussions`, and `/api/atlas/ingest`.

## Atlas Agent

Atlas is the daily research intelligence agent for AISci.fans. It scans papers, preprints, patents, GitHub projects, conference updates, lab announcements, startup activity, and funding signals, then returns structured recommendations for the product and research graph.

The first implemented ingestion job uses OpenAlex and Semantic Scholar and writes candidates as `pending`; founder/admin approval is required before public display.
