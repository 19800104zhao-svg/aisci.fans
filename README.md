# AISci.fans

AISci.fans is an AI-native science network for organizing frontier problems, exceptional researchers, young talent, virtual labs, and venture-scale commercialization opportunities.

## Local Development

```bash
python3 -m http.server 4173
```

Open `http://localhost:4173`.

## Deploy

This is a static site. Deploy the repository root to Vercel, Netlify, Cloudflare Pages, GitHub Pages, or any static host.

For production, prefer a host that supports custom response headers. This repository includes `vercel.json` and Netlify-style `_headers` with a strict baseline Content Security Policy and browser hardening headers.

## Atlas Agent

Atlas is the daily research intelligence agent for AISci.fans. It scans papers, preprints, patents, GitHub projects, conference updates, lab announcements, startup activity, and funding signals, then returns structured recommendations for the product and research graph.
