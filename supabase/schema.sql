-- AISci.fans June 1 MVP schema for Supabase Postgres.
-- Run this in Supabase SQL Editor before enabling production traffic.

create extension if not exists pgcrypto;

create or replace function public.is_founder_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(lower(auth.jwt() ->> 'email'), '') = '19800104zhao@gmail.com'
    or coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin'
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  display_name text not null,
  role text not null default 'talent' check (role in ('talent', 'lab', 'capital', 'scientist', 'admin')),
  organization text,
  country text,
  headline text,
  profile_type text check (profile_type in ('talent', 'lab', 'capital', 'scientist', 'admin')),
  focus_area text,
  bio text,
  website text,
  public_links jsonb not null default '[]'::jsonb,
  proof_links jsonb not null default '[]'::jsonb,
  is_admin boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (
    id,
    email,
    display_name,
    role,
    organization,
    country,
    headline,
    profile_type,
    is_admin
  )
  values (
    new.id,
    lower(new.email),
    coalesce(new.raw_user_meta_data ->> 'name', new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    case
      when lower(new.email) = '19800104zhao@gmail.com' then 'admin'
      when new.raw_user_meta_data ->> 'role' in ('talent', 'lab', 'capital', 'scientist') then new.raw_user_meta_data ->> 'role'
      else 'talent'
    end,
    nullif(new.raw_user_meta_data ->> 'organization', ''),
    nullif(new.raw_user_meta_data ->> 'country', ''),
    nullif(new.raw_user_meta_data ->> 'headline', ''),
    case
      when lower(new.email) = '19800104zhao@gmail.com' then 'admin'
      when new.raw_user_meta_data ->> 'role' in ('talent', 'lab', 'capital', 'scientist') then new.raw_user_meta_data ->> 'role'
      else 'talent'
    end,
    lower(new.email) = '19800104zhao@gmail.com'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_auth_user();

create table if not exists public.research_problems (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  summary text not null,
  domain text not null,
  score integer not null default 80 check (score between 0 and 100),
  why_now text,
  bottlenecks jsonb not null default '[]'::jsonb,
  progress_summary text,
  search_query text,
  source_urls jsonb not null default '[]'::jsonb,
  status text not null default 'pending' check (status in ('pending', 'public', 'private', 'rejected', 'flagged', 'archived')),
  confidence numeric(4,3) not null default 0.500 check (confidence >= 0 and confidence <= 1),
  admin_note text,
  reviewed_by uuid references public.profiles(id) on delete set null,
  reviewed_at timestamptz,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.problem_progress (
  id uuid primary key default gen_random_uuid(),
  problem_id uuid not null references public.research_problems(id) on delete cascade,
  title text not null,
  body text not null,
  source text,
  source_url text not null,
  status text not null default 'pending' check (status in ('pending', 'public', 'private', 'rejected', 'flagged', 'archived')),
  confidence numeric(4,3) not null default 0.500 check (confidence >= 0 and confidence <= 1),
  admin_note text,
  reviewed_by uuid references public.profiles(id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.papers (
  id uuid primary key default gen_random_uuid(),
  problem_id uuid references public.research_problems(id) on delete set null,
  title text not null,
  abstract text,
  doi text,
  openalex_id text,
  semantic_scholar_id text,
  arxiv_id text,
  source text,
  source_url text not null,
  year integer,
  venue text,
  authors jsonb not null default '[]'::jsonb,
  status text not null default 'pending' check (status in ('pending', 'public', 'private', 'rejected', 'flagged', 'archived')),
  confidence numeric(4,3) not null default 0.500 check (confidence >= 0 and confidence <= 1),
  admin_note text,
  reviewed_by uuid references public.profiles(id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.scientists (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  full_name text not null,
  affiliation text,
  orcid text,
  openalex_id text,
  semantic_scholar_id text,
  website text,
  expertise jsonb not null default '[]'::jsonb,
  source text,
  source_url text,
  status text not null default 'pending' check (status in ('pending', 'public', 'private', 'rejected', 'flagged', 'archived')),
  confidence numeric(4,3) not null default 0.500 check (confidence >= 0 and confidence <= 1),
  claimed_by uuid references public.profiles(id) on delete set null,
  claim_status text not null default 'unclaimed' check (claim_status in ('unclaimed', 'pending', 'verified', 'rejected')),
  admin_note text,
  reviewed_by uuid references public.profiles(id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.problem_scientists (
  problem_id uuid not null references public.research_problems(id) on delete cascade,
  scientist_id uuid not null references public.scientists(id) on delete cascade,
  relationship text not null default 'related',
  confidence numeric(4,3) not null default 0.500 check (confidence >= 0 and confidence <= 1),
  created_at timestamptz not null default now(),
  primary key (problem_id, scientist_id)
);

create table if not exists public.follows (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  problem_id uuid not null references public.research_problems(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, problem_id)
);

create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  problem_id uuid references public.research_problems(id) on delete set null,
  scientist_id uuid references public.scientists(id) on delete set null,
  type text not null check (type in ('talent', 'lab', 'capital', 'proof', 'interaction')),
  title text not null,
  payload jsonb not null,
  visibility text not null default 'private' check (visibility in ('private', 'pending_public', 'public')),
  status text not null default 'pending' check (status in ('pending', 'approved', 'public', 'private', 'rejected', 'flagged', 'archived')),
  source_url text,
  admin_note text,
  reviewed_by uuid references public.profiles(id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.problem_discussions (
  id uuid primary key default gen_random_uuid(),
  problem_id uuid not null references public.research_problems(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  parent_id uuid references public.problem_discussions(id) on delete cascade,
  title text not null,
  body text not null,
  source_url text,
  visibility text not null default 'pending_public' check (visibility in ('private', 'pending_public', 'public')),
  status text not null default 'pending' check (status in ('pending', 'approved', 'public', 'private', 'rejected', 'flagged', 'archived')),
  admin_note text,
  reviewed_by uuid references public.profiles(id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.claim_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  scientist_id uuid references public.scientists(id) on delete set null,
  target_scientist_name text not null,
  evidence_type text not null,
  evidence_url text,
  evidence_payload jsonb not null default '{}'::jsonb,
  status text not null default 'pending' check (status in ('pending', 'approved', 'public', 'private', 'rejected', 'flagged', 'archived')),
  admin_note text,
  reviewed_by uuid references public.profiles(id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.admin_reviews (
  id uuid primary key default gen_random_uuid(),
  reviewer_id uuid references public.profiles(id) on delete set null,
  entity_type text not null,
  entity_id text not null,
  decision text not null,
  note text,
  created_at timestamptz not null default now()
);

create table if not exists public.flags (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  entity_type text not null,
  entity_id text not null,
  reason text not null,
  status text not null default 'pending' check (status in ('pending', 'resolved', 'rejected', 'flagged', 'archived')),
  admin_note text,
  reviewed_by uuid references public.profiles(id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ingestion_runs (
  id uuid primary key default gen_random_uuid(),
  status text not null default 'running' check (status in ('running', 'success', 'partial_success', 'failed')),
  records_seen integer not null default 0,
  error_message text,
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.ingestion_logs (
  id uuid primary key default gen_random_uuid(),
  run_id uuid references public.ingestion_runs(id) on delete cascade,
  source text not null,
  problem_id uuid references public.research_problems(id) on delete set null,
  status text not null check (status in ('success', 'failed', 'skipped')),
  message text,
  record_count integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists profiles_email_idx on public.profiles (email);
create index if not exists research_problems_status_score_idx on public.research_problems (status, score desc);
create index if not exists research_problems_domain_idx on public.research_problems (domain);
create index if not exists problem_progress_problem_status_idx on public.problem_progress (problem_id, status, created_at desc);
create index if not exists papers_problem_status_idx on public.papers (problem_id, status, year desc);
create unique index if not exists papers_doi_unique_idx on public.papers (doi) where doi is not null;
create unique index if not exists papers_openalex_unique_idx on public.papers (openalex_id) where openalex_id is not null;
create unique index if not exists papers_semantic_unique_idx on public.papers (semantic_scholar_id) where semantic_scholar_id is not null;
create index if not exists papers_authors_gin_idx on public.papers using gin (authors);
create index if not exists scientists_status_confidence_idx on public.scientists (status, confidence desc);
create index if not exists scientists_orcid_idx on public.scientists (orcid) where orcid is not null;
create index if not exists follows_user_idx on public.follows (user_id, created_at desc);
create index if not exists follows_problem_idx on public.follows (problem_id);
create index if not exists submissions_user_created_idx on public.submissions (user_id, created_at desc);
create index if not exists submissions_status_created_idx on public.submissions (status, created_at desc);
create index if not exists problem_discussions_problem_status_idx on public.problem_discussions (problem_id, status, created_at desc);
create index if not exists problem_discussions_user_created_idx on public.problem_discussions (user_id, created_at desc);
create index if not exists problem_discussions_status_created_idx on public.problem_discussions (status, created_at desc);
create index if not exists claim_requests_user_created_idx on public.claim_requests (user_id, created_at desc);
create index if not exists claim_requests_status_created_idx on public.claim_requests (status, created_at desc);
create index if not exists ingestion_logs_run_idx on public.ingestion_logs (run_id, created_at desc);
create index if not exists ingestion_logs_problem_idx on public.ingestion_logs (problem_id);

alter table public.profiles enable row level security;
alter table public.research_problems enable row level security;
alter table public.problem_progress enable row level security;
alter table public.papers enable row level security;
alter table public.scientists enable row level security;
alter table public.problem_scientists enable row level security;
alter table public.follows enable row level security;
alter table public.submissions enable row level security;
alter table public.problem_discussions enable row level security;
alter table public.claim_requests enable row level security;
alter table public.admin_reviews enable row level security;
alter table public.flags enable row level security;
alter table public.ingestion_runs enable row level security;
alter table public.ingestion_logs enable row level security;

drop policy if exists "profiles own or admin read" on public.profiles;
create policy "profiles own or admin read" on public.profiles
  for select to authenticated
  using ((select auth.uid()) = id or (select public.is_founder_admin()));

drop policy if exists "profiles own update" on public.profiles;
drop policy if exists "profiles admin update" on public.profiles;
create policy "profiles admin update" on public.profiles
  for update to authenticated
  using ((select public.is_founder_admin()))
  with check ((select public.is_founder_admin()));

drop policy if exists "public read problems" on public.research_problems;
create policy "public read problems" on public.research_problems
  for select to anon, authenticated
  using (status = 'public' or (select public.is_founder_admin()));

drop policy if exists "public read progress" on public.problem_progress;
create policy "public read progress" on public.problem_progress
  for select to anon, authenticated
  using (status = 'public' or (select public.is_founder_admin()));

drop policy if exists "public read papers" on public.papers;
create policy "public read papers" on public.papers
  for select to anon, authenticated
  using (status = 'public' or (select public.is_founder_admin()));

drop policy if exists "public read scientists" on public.scientists;
create policy "public read scientists" on public.scientists
  for select to anon, authenticated
  using (status = 'public' or (select public.is_founder_admin()));

drop policy if exists "public read problem scientists" on public.problem_scientists;
create policy "public read problem scientists" on public.problem_scientists
  for select to anon, authenticated
  using (
    (select public.is_founder_admin())
    or (
      exists (
        select 1 from public.research_problems
        where research_problems.id = problem_scientists.problem_id
          and research_problems.status = 'public'
      )
      and exists (
        select 1 from public.scientists
        where scientists.id = problem_scientists.scientist_id
          and scientists.status = 'public'
      )
    )
  );

drop policy if exists "follows own read" on public.follows;
create policy "follows own read" on public.follows
  for select to authenticated
  using ((select auth.uid()) = user_id or (select public.is_founder_admin()));

drop policy if exists "follows own insert" on public.follows;
create policy "follows own insert" on public.follows
  for insert to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "follows own delete" on public.follows;
create policy "follows own delete" on public.follows
  for delete to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "submissions own read" on public.submissions;
create policy "submissions own read" on public.submissions
  for select to authenticated
  using ((select auth.uid()) = user_id or visibility = 'public' or (select public.is_founder_admin()));

drop policy if exists "submissions own insert" on public.submissions;
create policy "submissions own insert" on public.submissions
  for insert to authenticated
  with check (
    (select auth.uid()) = user_id
    and visibility in ('private', 'pending_public')
    and status = 'pending'
  );

drop policy if exists "discussions public own admin read" on public.problem_discussions;
create policy "discussions public own admin read" on public.problem_discussions
  for select to anon, authenticated
  using (
    status = 'public'
    or visibility = 'public'
    or (select auth.uid()) = user_id
    or (select public.is_founder_admin())
  );

drop policy if exists "discussions own insert" on public.problem_discussions;
create policy "discussions own insert" on public.problem_discussions
  for insert to authenticated
  with check (
    (select auth.uid()) = user_id
    and visibility in ('private', 'pending_public')
    and status = 'pending'
  );

drop policy if exists "claims own read" on public.claim_requests;
create policy "claims own read" on public.claim_requests
  for select to authenticated
  using ((select auth.uid()) = user_id or (select public.is_founder_admin()));

drop policy if exists "claims own insert" on public.claim_requests;
create policy "claims own insert" on public.claim_requests
  for insert to authenticated
  with check (
    (select auth.uid()) = user_id
    and status = 'pending'
  );

drop policy if exists "admin reviews admin read" on public.admin_reviews;
create policy "admin reviews admin read" on public.admin_reviews
  for select to authenticated
  using ((select public.is_founder_admin()));

drop policy if exists "flags own insert" on public.flags;
create policy "flags own insert" on public.flags
  for insert to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "flags admin read" on public.flags;
create policy "flags admin read" on public.flags
  for select to authenticated
  using ((select public.is_founder_admin()));

drop policy if exists "ingestion runs admin read" on public.ingestion_runs;
create policy "ingestion runs admin read" on public.ingestion_runs
  for select to authenticated
  using ((select public.is_founder_admin()));

drop policy if exists "ingestion logs admin read" on public.ingestion_logs;
create policy "ingestion logs admin read" on public.ingestion_logs
  for select to authenticated
  using ((select public.is_founder_admin()));

insert into public.research_problems
  (slug, title, summary, domain, score, why_now, bottlenecks, progress_summary, search_query, source_urls, status, confidence, published_at)
values
  ('frontier-ai-audit', 'How can frontier AI systems be scientifically audited before deployment?', 'AI safety must become measurable engineering: evaluations, monitoring, red-teaming, governance, and independent audit trails.', 'safety', 98, 'Frontier models are entering enterprise and public workflows faster than independent audit standards mature.', '["Gaming-resistant evaluations", "Independent monitoring", "Governance evidence trails"]'::jsonb, 'Public audit institutions, eval labs, and model developers are converging on richer evaluation and monitoring standards.', 'frontier AI evaluation model audit safety red teaming', '[]'::jsonb, 'public', 0.800, now()),
  ('reproducible-ai-science', 'How can AI accelerate discovery without making science less reproducible?', 'Research agents can multiply output, but evidence, code, data, uncertainty, and failed attempts must remain traceable.', 'safety', 96, 'AI research agents are moving from demos into scientific workflows.', '["Source provenance", "Executable experiments", "Negative-result capture"]'::jsonb, 'Agent labs and open science communities are beginning to formalize provenance, replication, and review loops.', 'AI for science reproducibility research agents provenance', '[]'::jsonb, 'public', 0.780, now()),
  ('validated-ai-medicine', 'How can AI-designed proteins and medicines become validated therapies?', 'Protein design, generative chemistry, and biological foundation models need validation loops that connect model score to real biology.', 'biology', 95, 'AI biology has strong model progress but value depends on wet-lab and clinical validation.', '["Wet-lab validation", "Toxicity and manufacturability", "Clinical relevance"]'::jsonb, 'Model-driven design is improving, while the strongest opportunities now require assay, failure-case, and translation evidence.', 'AI protein design drug discovery wet lab validation', '[]'::jsonb, 'public', 0.790, now()),
  ('pandemic-early-warning', 'How can the world detect and stop the next pandemic before it spreads?', 'Wastewater, genomic surveillance, animal monitoring, clinical signals, and AI triage need to become one early-warning network.', 'biology', 94, 'Fragmented pathogen signals can become actionable earlier with better data integration.', '["Cross-border data fragmentation", "Signal quality", "Response speed"]'::jsonb, 'Sequencing, wastewater, and public-health data systems are improving, but integration and incentives remain weak.', 'pandemic early warning genomic surveillance wastewater', '[]'::jsonb, 'public', 0.760, now()),
  ('antimicrobial-resistance', 'How can humanity beat antimicrobial resistance with diagnostics, drugs, vaccines, and stewardship?', 'Drug-resistant infections require faster diagnostics, new modalities, vaccines, and disciplined stewardship.', 'biology', 93, 'AMR is a slow-moving global crisis with clear diagnostic and incentive gaps.', '["Broken antibiotic economics", "Rapid diagnostics", "Stewardship behavior"]'::jsonb, 'Diagnostics, phage platforms, vaccines, and new incentive models are active, but adoption paths remain uneven.', 'antimicrobial resistance diagnostics drug discovery stewardship', '[]'::jsonb, 'public', 0.760, now()),
  ('autonomous-climate-materials', 'Can autonomous labs discover batteries, catalysts, chips, and climate materials fast enough?', 'Self-driving labs could compress discovery cycles for batteries, catalysts, semiconductors, carbon capture, and industrial materials.', 'materials', 96, 'Climate and compute infrastructure need faster materials discovery and validation.', '["Synthesis feasibility", "Robot-compatible protocols", "Failed-result datasets"]'::jsonb, 'Self-driving lab methods are advancing, but data standards and equipment constraints still limit scaling.', 'self driving laboratory autonomous materials discovery batteries catalysts', '[]'::jsonb, 'public', 0.780, now()),
  ('clean-power-ai-grid', 'How can clean power, grids, storage, and critical minerals support AI and electrification?', 'AI data centers, electrified transport, heat, and industry increase demand for reliable clean power and resilient grids.', 'materials', 95, 'Compute and electrification are exposing grid, storage, permitting, and mineral bottlenecks.', '["Interconnection queues", "Long-duration storage", "Transmission and minerals"]'::jsonb, 'Grid software, storage, geothermal, nuclear services, and mineral processing are active opportunity areas.', 'clean power grid storage critical minerals AI data centers', '[]'::jsonb, 'public', 0.760, now()),
  ('resilient-food-systems', 'How can agriculture fix nitrogen, water stress, and soil carbon while protecting food security?', 'Food systems must produce more with less fertilizer waste, less water stress, healthier soils, and lower climate risk.', 'biology', 91, 'Food security, climate adaptation, and farm economics are now tightly linked.', '["Field variability", "Farmer incentives", "Soil measurement"]'::jsonb, 'Biological inputs, crop resilience, irrigation, and soil measurement are improving but need stronger field evidence.', 'resilient food systems nitrogen water stress soil carbon', '[]'::jsonb, 'public', 0.720, now()),
  ('robotic-science-work', 'How can robots become safe, reliable research assistants in real physical environments?', 'Science automation needs robots that can operate, observe, correct mistakes, follow protocols, and work safely around humans.', 'robotics', 90, 'Lab automation and embodied AI are moving toward real scientific work, not only demos.', '["Long-horizon reliability", "Hardware variation", "Safety constraints"]'::jsonb, 'Robotics labs and automation companies are improving manipulation and protocol execution, but reliability remains the core bottleneck.', 'robotic laboratory automation embodied AI science', '[]'::jsonb, 'public', 0.720, now()),
  ('science-to-company', 'How can discoveries become companies without losing openness, trust, and global talent mobility?', 'The world needs better paths from research problem to proof, lab, company, capital, and public benefit.', 'institutions', 92, 'Deep-tech formation is constrained by fragmented institutions, IP rules, talent, and capital workflows.', '["IP posture", "Founder gaps", "Public-good boundaries"]'::jsonb, 'Translational institutes, venture studios, and science funders are experimenting with new formation paths.', 'science commercialization technology transfer deep tech venture creation', '[]'::jsonb, 'public', 0.730, now())
on conflict (slug) do update set
  title = excluded.title,
  summary = excluded.summary,
  domain = excluded.domain,
  score = excluded.score,
  why_now = excluded.why_now,
  bottlenecks = excluded.bottlenecks,
  progress_summary = excluded.progress_summary,
  search_query = excluded.search_query,
  status = 'public',
  confidence = excluded.confidence,
  updated_at = now();
