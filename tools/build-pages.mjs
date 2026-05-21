import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const siteUrl = "https://aisci.fans";

const nav = [
  ["Problems", "/problems/"],
  ["Talent", "/talent/"],
  ["Labs", "/labs/"],
  ["Capital", "/capital/"],
  ["Atlas", "/atlas/"],
];

const pages = [
  {
    path: "problems/index.html",
    active: "Problems",
    title: "Problems | AISci.fans",
    description:
      "The AISci problem library organizes the world's most important scientific questions into bottlenecks, talent tasks, labs, data, and capital paths.",
    kicker: "Problem Library",
    h1: "A command center for frontier scientific questions.",
    lead:
      "Every problem page is designed to become an operating unit: scientific bottleneck, evidence map, researchers, student proof-of-work, virtual lab path, and venture thesis.",
    stats: [["10", "great questions"], ["4", "operating domains"], ["24h", "Atlas refresh"]],
    cards: [
      {
        title: "AI safety audit stack",
        href: "/problems/frontier-ai-audit/",
        body: "Evals, monitoring, red-teaming, governance, and independent audit trails for frontier AI systems.",
        meta: "AI Safety · Governance",
      },
      {
        title: "Reproducible AI science",
        href: "/problems/reproducible-ai-science/",
        body: "Make agent-generated science traceable, reproducible, reviewable, and honest about uncertainty.",
        meta: "Research Agents · Open Science",
      },
      {
        title: "Validated AI medicine",
        href: "/problems/validated-ai-medicine/",
        body: "Move protein design and AI drug discovery from model score to clinical-grade validation loops.",
        meta: "AI Biology · Therapeutics",
      },
      {
        title: "Pandemic early warning",
        href: "/problems/pandemic-early-warning/",
        body: "Fuse wastewater, sequencing, animal, clinical, and AI signals into a global warning network.",
        meta: "Public Health · Genomics",
      },
      {
        title: "AMR response systems",
        href: "/problems/antimicrobial-resistance/",
        body: "Diagnostics, new modalities, vaccines, and stewardship for drug-resistant infections.",
        meta: "Diagnostics · Drug Discovery",
      },
      {
        title: "Autonomous climate materials",
        href: "/problems/autonomous-climate-materials/",
        body: "Self-driving labs for batteries, catalysts, semiconductors, carbon capture, and critical materials.",
        meta: "Materials · Energy",
      },
      {
        title: "Clean power for AI and electrification",
        href: "/problems/clean-power-ai-grid/",
        body: "Plan the grid, storage, and critical minerals needed for AI, transport, heat, and industry.",
        meta: "Energy · Grid",
      },
      {
        title: "Resilient food systems",
        href: "/problems/resilient-food-systems/",
        body: "Improve nitrogen, water, soil carbon, and food security without breaking farmer incentives.",
        meta: "Food · Climate",
      },
      {
        title: "Robotic science work",
        href: "/problems/robotic-science-work/",
        body: "Make robots safe and reliable enough to execute real research protocols in physical environments.",
        meta: "Robotics · Lab Automation",
      },
      {
        title: "Science-to-company pathways",
        href: "/problems/science-to-company/",
        body: "Turn discoveries into companies without losing openness, trust, or global talent mobility.",
        meta: "Venture · Institutions",
      },
    ],
    sections: [
      {
        title: "How the problem library works",
        items: [
          "Rank by scientific urgency, global stakes, tractable proof-of-work, and commercialization optionality.",
          "Attach every question to bottlenecks, datasets, labs, young talent tasks, funding hypotheses, and governance risks.",
          "Let Atlas update each card daily as papers, code, patents, conferences, and startup signals change.",
        ],
      },
    ],
  },
  {
    path: "talent/index.html",
    active: "Talent",
    title: "Talent | AISci.fans",
    description:
      "AISci talent discovery ranks young scientists by public proof-of-work, replication ability, benchmark contributions, and expert review.",
    kicker: "Talent System",
    h1: "Find the people who can actually move the problem.",
    lead:
      "The talent layer is not a resume database. It is a living proof system for young researchers, independent builders, and cross-disciplinary operators.",
    stats: [["4", "proof types"], ["48h", "challenge loops"], ["2", "review modes"]],
    cards: [
      {
        title: "Research Passport",
        href: "/talent/research-passport/",
        body: "A portable profile built from replications, benchmarks, datasets, code quality, writing, and expert review.",
        meta: "Profile · Proof",
      },
      {
        title: "Open Challenges",
        href: "/talent/open-challenges/",
        body: "Problem-specific tasks that let young talent earn visibility through real contributions.",
        meta: "Tasks · Mentorship",
      },
      {
        title: "Hidden talent radar",
        href: "/talent/hidden-talent-radar/",
        body: "Detect independent replication, cross-field synthesis, technical writing, and open-source signal before credentials appear.",
        meta: "Discovery · Ranking",
      },
    ],
    sections: [
      {
        title: "Talent objects",
        items: [
          "Passport: verified proof bundle for one person.",
          "Challenge: scoped task linked to one frontier problem.",
          "Review: expert or mentor assessment with evidence and confidence.",
          "Cohort: group of students attached to a virtual lab agenda.",
        ],
      },
    ],
  },
  {
    path: "labs/index.html",
    active: "Labs",
    title: "Virtual Labs | AISci.fans",
    description:
      "AISci virtual labs help top researchers organize global students around frontier agendas, open tasks, data, tools, and capital paths.",
    kicker: "Virtual Labs",
    h1: "Turn a scientific agenda into a global working group.",
    lead:
      "A lab is a repeatable execution environment: principal investigator, research agenda, open tasks, student cohort, evidence rules, dataset stack, and commercialization boundary.",
    stats: [["3", "launch labs"], ["26", "open tasks"], ["90d", "sprint horizon"]],
    cards: [
      {
        title: "AI Drug Discovery Lab",
        href: "/labs/ai-drug-discovery/",
        body: "From target discovery to wet-lab validation, organize publishable research and company-forming assets in one workflow.",
        meta: "Biology · Therapeutics",
      },
      {
        title: "Autonomous Materials Lab",
        href: "/labs/autonomous-materials/",
        body: "Coordinate synthesis feasibility, robotic experiments, failed-result capture, and materials property prediction.",
        meta: "Materials · Robotics",
      },
      {
        title: "Verifiable AI Safety Lab",
        href: "/labs/verifiable-ai-safety/",
        body: "Connect evals, formal reasoning, monitoring, red-team data, and governance into deployable safety mechanisms.",
        meta: "AI Safety · Audit",
      },
    ],
    sections: [
      {
        title: "Lab operating model",
        items: [
          "Program memo: problem, milestones, evidence standard, talent path, capital boundary.",
          "Task board: reproducible tasks with source links, owners, mentor review, and completion evidence.",
          "Review cadence: weekly mentor review, monthly expert audit, quarterly capital-readiness memo.",
        ],
      },
    ],
  },
  {
    path: "capital/index.html",
    active: "Capital",
    title: "Capital | AISci.fans",
    description:
      "AISci capital pages translate scientific bottlenecks into investable theses, diligence memos, venture formation paths, and risk maps.",
    kicker: "Capital Layer",
    h1: "Show investors evidence, not buzzwords.",
    lead:
      "The capital layer turns problem cards into translation opportunities: why now, what proof exists, who can build, what must be validated, and what company could emerge.",
    stats: [["3", "venture theses"], ["4", "risk axes"], ["1", "investor memo format"]],
    cards: [
      {
        title: "Translation Opportunities",
        href: "/capital/translation-opportunities/",
        body: "Rank near-commercial scientific bottlenecks by evidence, timing, team availability, and market pull.",
        meta: "Thesis · Market",
      },
      {
        title: "Investor Briefing Room",
        href: "/capital/investor-briefing/",
        body: "A diligence surface for VCs: problem proof, technical risks, founders, labs, IP, regulation, and financing route.",
        meta: "Diligence · VC",
      },
      {
        title: "Science-to-company path",
        href: "/capital/science-to-company/",
        body: "Convert open research into startups while preserving trust, openness, and talent mobility.",
        meta: "Company Formation",
      },
    ],
    sections: [
      {
        title: "Capital objects",
        items: [
          "Opportunity: a bottleneck with evidence of scientific and commercial readiness.",
          "Memo: concise diligence note with market, proof, team, risk, and next validation step.",
          "Formation path: lab-to-company plan with IP posture, founder gap, funding route, and public-good boundary.",
        ],
      },
    ],
  },
  {
    path: "atlas/index.html",
    active: "Atlas",
    title: "Atlas Agent | AISci.fans",
    description:
      "Atlas is the AISci intelligence and self-improvement agent that scans science, startups, products, failures, and traffic every day.",
    kicker: "Atlas Agent",
    h1: "The monitoring layer for a self-improving science OS.",
    lead:
      "Atlas scans the external world and the product's own weak spots. It should learn like the YC self-improving company pattern: observe failures, classify causes, patch the system, and report what improved.",
    stats: [["08:30", "science scout"], ["09:10", "traffic report"], ["24h", "product loop"]],
    cards: [
      {
        title: "Daily Product Scout",
        href: "/atlas/daily-scout/",
        body: "Scan products, papers, patents, labs, startups, and funding signals for what AISci should learn next.",
        meta: "Market · Research",
      },
      {
        title: "Self-improvement loop",
        href: "/atlas/self-improvement-loop/",
        body: "Monitor failed queries, missing tools, missing data, weak prompts, and code gaps; then recommend or patch improvements.",
        meta: "Agent Ops",
      },
      {
        title: "Traffic report",
        href: "/atlas/traffic-report/",
        body: "Daily Vercel Analytics summary: visitors, page views, top pages, referrers, and one growth action.",
        meta: "Analytics · Growth",
      },
    ],
    sections: [
      {
        title: "Agent outputs",
        items: [
          "Daily science/product brief with evidence and source links.",
          "24-72 hour implementation backlog.",
          "Launch readiness check against 2026-07-21.",
          "Self-improvement log with root cause and exact patch recommendation.",
        ],
      },
    ],
  },
];

const detailPages = [
  detail("problems/frontier-ai-audit/index.html", "Problems", "Frontier AI Audit Stack | AISci.fans", "A detailed AISci problem page for scientific audit of frontier AI systems.", "Problem Detail", "Frontier AI audit stack", "Turn AI safety into measurable engineering: evaluations, monitoring, red-team data, governance, and independent audit trails.", [["Domain", "AI Safety"], ["Score", "98"], ["Next proof", "Anti-gaming eval suite"]], ["Define auditable deployment gates for frontier models.", "Build a shared evidence standard for evals, incident reports, and capability monitoring.", "Recruit young talent through replication tasks and falsifiable threat models."], [["Bottleneck", "Capabilities move faster than public test methods, and many benchmarks fail outside controlled settings."], ["Who to map", "UK AI Security Institute, METR, ARC Evals, Anthropic, governance researchers, enterprise AI risk teams."], ["Commercial path", "Model audit, compliance infrastructure, safety monitoring, and enterprise AI governance."]]),
  detail("problems/reproducible-ai-science/index.html", "Problems", "Reproducible AI Science | AISci.fans", "A detailed AISci problem page for reproducible AI-assisted scientific discovery.", "Problem Detail", "Reproducible AI science", "Make AI-generated research traceable, falsifiable, and useful instead of just faster.", [["Domain", "Research Agents"], ["Score", "96"], ["Next proof", "Source-grounded benchmark"]], ["Attach every claim to source trails, code, data, negative results, and uncertainty.", "Design tasks where agents must produce executable experiments rather than fluent summaries.", "Create review workflows for mentor, expert, and replication checks."], [["Bottleneck", "Agent outputs often miss provenance, failed attempts, and real-world experimental constraints."], ["Who to map", "FutureHouse, Sakana AI, OpenAI, open science communities, academic agent labs."], ["Commercial path", "Research OS, pharma knowledge systems, reproducible review tools, and automated diligence."]]),
  detail("problems/validated-ai-medicine/index.html", "Problems", "Validated AI Medicine | AISci.fans", "A detailed AISci problem page for AI-designed proteins, medicines, and wet-lab validation.", "Problem Detail", "Validated AI medicine", "Move AI biology from model score to real validation: binding, stability, toxicity, manufacturability, and clinical relevance.", [["Domain", "AI Biology"], ["Score", "95"], ["Next proof", "Wet-lab benchmark"]], ["Compare model predictions against real assay outcomes.", "Build failure-case libraries for protein and small-molecule design.", "Connect research passports to lab tasks that produce validation evidence."], [["Bottleneck", "Model scores diverge from real biology and clinical constraints."], ["Who to map", "David Baker Lab, Isomorphic Labs, Arc Institute, DeepMind, translational biology teams."], ["Commercial path", "Platform biotech, automated CRO, data asset company, or modality-specific therapeutic startup."]]),
  detail("problems/pandemic-early-warning/index.html", "Problems", "Pandemic Early Warning | AISci.fans", "A detailed AISci problem page for pandemic surveillance and early warning systems.", "Problem Detail", "Pandemic early warning", "Detect and stop the next pandemic before it spreads by linking genomic, wastewater, animal, clinical, and AI triage signals.", [["Domain", "Public Health"], ["Score", "94"], ["Next proof", "Cross-signal dashboard"]], ["Map fragmented surveillance data across agencies, species, sequencing labs, and hospitals.", "Build early-warning dashboards with source quality and uncertainty visible.", "Recruit data scientists through outbreak analysis and spillover modeling challenges."], [["Bottleneck", "Data is fragmented, incentives differ across borders, and response systems are often slower than spread."], ["Who to map", "WHO networks, GISAID community, Broad Institute, pandemic preparedness labs."], ["Commercial path", "Diagnostics, biosurveillance software, public-health data tools, and rapid vaccine infrastructure."]]),
  detail("problems/antimicrobial-resistance/index.html", "Problems", "Antimicrobial Resistance | AISci.fans", "A detailed AISci problem page for antimicrobial resistance diagnostics, drugs, vaccines, and stewardship.", "Problem Detail", "Antimicrobial resistance response", "Beat drug-resistant infections with faster diagnostics, new modalities, vaccines, and disciplined stewardship.", [["Domain", "Bio / Health"], ["Score", "93"], ["Next proof", "Rapid diagnostic workflow"]], ["Map resistance datasets and diagnostic gaps.", "Identify new modalities and where stewardship software changes behavior.", "Create tasks for young talent in resistance data mining and hospital decision support."], [["Bottleneck", "The antibiotic market needs reserve drugs, but companies need sustainable incentives and clinical paths."], ["Who to map", "WHO AMR programs, CARB-X, Wellcome, antibiotic discovery labs."], ["Commercial path", "Rapid diagnostics, phage platforms, narrow-spectrum drugs, and hospital decision software."]]),
  detail("problems/autonomous-climate-materials/index.html", "Problems", "Autonomous Climate Materials | AISci.fans", "A detailed AISci problem page for self-driving labs and climate-critical materials.", "Problem Detail", "Autonomous climate materials", "Compress discovery cycles for batteries, catalysts, chips, carbon capture, and industrial decarbonization materials.", [["Domain", "Energy / Materials"], ["Score", "96"], ["Next proof", "Closed-loop lab demo"]], ["Standardize failed-result capture.", "Map synthesis feasibility and equipment constraints.", "Build a capital memo for battery, catalyst, and semiconductor use cases."], [["Bottleneck", "Robotics, synthesis, model feedback, and reproducible data capture are not yet standardized."], ["Who to map", "Materials Project, self-driving lab groups, robotic chemistry labs, battery and catalyst researchers."], ["Commercial path", "Batteries, semiconductors, catalysts, critical minerals, and industrial decarbonization services."]]),
  detail("problems/clean-power-ai-grid/index.html", "Problems", "Clean Power For AI And Electrification | AISci.fans", "A detailed AISci problem page for clean power, grids, storage, and critical minerals.", "Problem Detail", "Clean power for AI and electrification", "Build the grid, storage, and critical-mineral system needed for AI data centers, transport, heat, and industry.", [["Domain", "Energy"], ["Score", "95"], ["Next proof", "Grid bottleneck map"]], ["Map interconnection queues, transmission gaps, storage duration, and mineral constraints.", "Recruit analysts to model demand response and storage economics.", "Translate bottlenecks into infrastructure software and hardware theses."], [["Bottleneck", "Permitting, interconnection, storage duration, transmission, and supply chains all limit deployment speed."], ["Who to map", "IEA, national labs, grid modeling groups, battery research labs."], ["Commercial path", "Grid software, long-duration storage, geothermal, nuclear services, demand response, and mineral processing."]]),
  detail("problems/resilient-food-systems/index.html", "Problems", "Resilient Food Systems | AISci.fans", "A detailed AISci problem page for nitrogen, water stress, soil carbon, and food security.", "Problem Detail", "Resilient food systems", "Improve food production while reducing fertilizer waste, water stress, soil degradation, and climate risk.", [["Domain", "Food / Climate"], ["Score", "91"], ["Next proof", "Field-trial evidence map"]], ["Map crop trial data and soil outcome measurement methods.", "Build tasks around nitrogen flows, water stress, and biological inputs.", "Clarify incentives for farmers, regulators, and buyers."], [["Bottleneck", "Field variability, farmer incentives, regulation, biology, and soil measurement make adoption slow."], ["Who to map", "CGIAR, plant science labs, soil carbon groups, ag biotech teams."], ["Commercial path", "Biological inputs, crop resilience, precision irrigation, soil measurement, and ag data tools."]]),
  detail("problems/robotic-science-work/index.html", "Problems", "Robotic Science Work | AISci.fans", "A detailed AISci problem page for robots as reliable research assistants.", "Problem Detail", "Robotic science work", "Make robots safe and reliable enough to execute real research protocols in physical environments.", [["Domain", "Automation"], ["Score", "90"], ["Next proof", "Long-horizon task benchmark"]], ["Define lab task datasets and safety constraints.", "Evaluate long-horizon success and visual correction.", "Connect hardware variability to protocol design."], [["Bottleneck", "Long-horizon reliability, hardware variation, safety constraints, and low-error experiments make generalization hard."], ["Who to map", "Stanford Robotics, Berkeley AI Research, DeepMind Robotics, lab automation teams."], ["Commercial path", "Lab automation hardware, robot software stacks, and vertical research services."]]),
  detail("problems/science-to-company/index.html", "Problems", "Science To Company Problem | AISci.fans", "A detailed AISci problem page for turning discoveries into companies while preserving openness and trust.", "Problem Detail", "Science-to-company pathways", "Build better paths from research problem to proof, lab, company, capital, and public benefit.", [["Domain", "Institutions"], ["Score", "92"], ["Next proof", "Formation workflow"]], ["Clarify what stays open and what becomes proprietary.", "Map IP constraints, founder gaps, data posture, and first paid market.", "Create a workflow that preserves global talent mobility."], [["Bottleneck", "Universities, labs, students, founders, investors, and governments each hold part of the workflow but lack one shared operating system."], ["Who to map", "Translational research institutes, university tech transfer, deep tech accelerators."], ["Commercial path", "Expert networks, virtual labs, science diligence, venture studios, and cross-border talent markets."]]),
  detail("talent/research-passport/index.html", "Talent", "Research Passport | AISci.fans", "The AISci research passport for proof-of-work based talent discovery.", "Talent Detail", "Research Passport", "A portable profile for young scientists based on public proof, not school names.", [["Proof types", "4"], ["Review modes", "2"], ["Primary user", "Young talent"]], ["Collect replications, benchmark contributions, datasets, code, writing, and expert review.", "Show what problem the person can actually move.", "Make the profile legible to mentors, labs, and investors."], [["Core fields", "Identity, location, focus area, proof objects, source links, review status, open tasks, mentor notes."], ["Anti-gaming", "Require source links, reproducible artifacts, reviewer confidence, and negative evidence where relevant."], ["Next build", "Turn the demo passport into a creation flow and public profile route."]]),
  detail("talent/open-challenges/index.html", "Talent", "Open Challenges | AISci.fans", "AISci open challenges turn frontier problems into concrete tasks for young talent.", "Talent Detail", "Open Challenges", "Problem-specific tasks that let young talent prove ability through useful work.", [["Cadence", "48h / 7d"], ["Review", "Mentor + expert"], ["Visibility", "Lab + VC"]], ["Create tasks from each problem's bottleneck.", "Specify evidence required for completion.", "Route top submissions to labs, mentors, and capital memos."], [["Challenge types", "Replication, dataset curation, benchmark design, technical memo, prototype, negative-result analysis."], ["Scoring", "Correctness, reproducibility, novelty, clarity, and usefulness to a lab agenda."], ["Next build", "Challenge detail pages with submission states and review rubrics."]]),
  detail("talent/hidden-talent-radar/index.html", "Talent", "Hidden Talent Radar | AISci.fans", "AISci hidden talent radar detects proof-of-work signals before credentials appear.", "Talent Detail", "Hidden talent radar", "Find unusual ability before the institution notices it.", [["Signals", "4"], ["Review", "Evidence first"], ["Output", "Talent shortlist"]], ["Watch independent replications, cross-field synthesis, benchmark improvements, and technical writing.", "Attach each signal to a problem, source link, and reviewer confidence.", "Route strong signals into passports, challenges, and lab cohorts."], [["Why it matters", "The best young talent may not yet have a famous affiliation, but their public work can already show taste and execution."], ["Anti-gaming", "Prefer reproducible artifacts, negative-result honesty, and third-party review over vanity metrics."], ["Next build", "Signal ingestion, duplicate detection, and ranked talent queues for each problem."]]),
  detail("labs/ai-drug-discovery/index.html", "Labs", "AI Drug Discovery Lab | AISci.fans", "An AISci virtual lab for AI drug discovery and wet-lab validation.", "Lab Detail", "AI Drug Discovery Lab", "A virtual lab that turns AI biology problems into validated experiments, datasets, and company-forming assets.", [["Stage", "Recruiting"], ["Tasks", "5"], ["Sprint", "90 days"]], ["Target discovery and prioritization.", "Protein or small-molecule design benchmark.", "Wet-lab validation partner map.", "Commercialization memo for top validated assets."], [["Program lead need", "A senior scientist who can define validation standards and reject weak evidence."], ["Student path", "Replication, assay dataset curation, model comparison, failure analysis, technical memo."], ["Company path", "Platform biotech, vertical disease area startup, automated CRO, or data asset company."]]),
  detail("labs/autonomous-materials/index.html", "Labs", "Autonomous Materials Lab | AISci.fans", "An AISci virtual lab for autonomous materials discovery and self-driving laboratories.", "Lab Detail", "Autonomous Materials Lab", "A virtual lab for materials discovery loops: predict, synthesize, test, learn, and repeat.", [["Stage", "Expert needed"], ["Tasks", "9"], ["Sprint", "90 days"]], ["Pick one material class with strong demand.", "Map synthesis constraints and robot compatibility.", "Create a failed-result dataset and model feedback loop.", "Write a capital memo for the first market."], [["Program lead need", "A materials scientist or robotic chemistry lead with real equipment constraints."], ["Student path", "Synthesis route prediction, dataset cleaning, literature map, robot protocol draft."], ["Company path", "Battery materials, catalyst discovery, semiconductor process materials, or lab automation software."]]),
  detail("labs/verifiable-ai-safety/index.html", "Labs", "Verifiable AI Safety Lab | AISci.fans", "An AISci virtual lab for deployable AI safety evaluations, monitoring, and auditability.", "Lab Detail", "Verifiable AI Safety Lab", "A virtual lab for turning AI safety claims into testable, auditable systems.", [["Stage", "Funding gap"], ["Tasks", "6"], ["Sprint", "90 days"]], ["Define anti-gaming evaluations and monitoring protocols.", "Connect formal reasoning, red-team datasets, and deployment governance.", "Publish reproducible task environments for young talent."], [["Program lead need", "A safety researcher who can connect theoretical risk to engineering evidence."], ["Student path", "Eval replication, threat-model writing, data labeling, audit trail design."], ["Company path", "Model audit, AI governance infrastructure, enterprise monitoring, safety certification."]]),
  detail("capital/translation-opportunities/index.html", "Capital", "Translation Opportunities | AISci.fans", "AISci translation opportunities rank science bottlenecks by evidence, timing, team, and market readiness.", "Capital Detail", "Translation Opportunities", "A ranked map of scientific bottlenecks that may be close to company formation.", [["Theses", "3"], ["Risk axes", "4"], ["Memo length", "1 page"]], ["Define why now.", "Identify proof already available.", "List missing technical validation.", "Map founder and expert gaps.", "Clarify public-good and IP boundaries."], [["Current theses", "Protein binder platforms, AI-native materials foundries, research-agent infrastructure."], ["Risk model", "Technical, regulatory, IP, team, capital intensity, and market timing."], ["Next build", "Opportunity pages with evidence links, comparable companies, and diligence checklist."]]),
  detail("capital/investor-briefing/index.html", "Capital", "Investor Briefing Room | AISci.fans", "The AISci investor briefing room is a diligence surface for science commercialization.", "Capital Detail", "Investor Briefing Room", "Give VCs a clean path from scientific problem to evidence, team, risk, and next validation step.", [["Audience", "VC / angels"], ["Format", "Diligence room"], ["Output", "Memo + intro"]], ["Summarize the problem and why it matters now.", "Show proof, missing proof, and sources.", "Identify labs, young talent, founders, and advisors.", "Recommend the next validation milestone before financing."], [["Data rooms", "Problem memo, lab evidence, talent passports, IP posture, market map, comparable companies."], ["What not to do", "Do not sell hype; show uncertainty and failure modes clearly."], ["Next build", "Downloadable investor memo template and lead capture."]]),
  detail("capital/science-to-company/index.html", "Capital", "Science To Company | AISci.fans", "AISci science-to-company paths help discoveries become companies without losing openness and trust.", "Capital Detail", "Science-to-company path", "Convert research into companies while keeping openness, trust, and global talent mobility.", [["Path", "Problem → Proof → Lab → Company"], ["Users", "Scientist + founder + VC"], ["Risk", "IP / trust"]], ["Decide what stays open and what becomes proprietary.", "Find founder gaps and mentor gaps.", "Create an IP and data posture.", "Define the first paid market and validation milestone."], [["Operating principle", "Commercialization should not require closing the global talent pipeline."], ["Boundary objects", "Open tasks, public benchmarks, private datasets, company memo, advisor map."], ["Next build", "Company formation workflow with decision checkpoints."]]),
  detail("atlas/daily-scout/index.html", "Atlas", "Atlas Daily Scout | AISci.fans", "Atlas Daily Scout scans science, products, startups, and capital signals for AISci.fans.", "Atlas Detail", "Atlas Daily Scout", "The daily intelligence run that keeps AISci's problem graph and product backlog alive.", [["Schedule", "08:30 JST"], ["Sources", "Papers + code + startups"], ["Output", "Chinese brief"]], ["Scan products and market references.", "Find frontier problems, researchers, young talent, labs, and capital signals.", "Produce a 24-72 hour backlog and launch-readiness warning."], [["Inputs", "Papers, preprints, patents, GitHub, conferences, labs, funding, product references."], ["Output schema", "References, problems, people, labs, capital opportunities, product improvements, blockers."], ["Next build", "Persist Atlas memory and show daily runs publicly."]]),
  detail("atlas/self-improvement-loop/index.html", "Atlas", "Atlas Self-Improvement Loop | AISci.fans", "The Atlas self-improvement loop applies YC-style monitoring to AISci.fans agent work.", "Atlas Detail", "Self-improvement loop", "Monitor weak queries and failed work, classify the root cause, and patch the system before the same failure repeats.", [["Pattern", "Observe → Classify → Patch"], ["Cadence", "Daily"], ["Output", "System improvement"]], ["Classify failures by missing tool, data, skill, prompt, product ambiguity, code gap, or external blocker.", "Recommend exact patches: docs, scripts, data views, tests, prompts, or product changes.", "Keep improvements low-risk unless founder approval is needed."], [["Inspired by", "The YC self-improving company pattern: monitoring agent observes failed queries and opens fixes."], ["Safety boundary", "No secrets, paid resources, destructive changes, or risky deploys without approval."], ["Next build", "A visible run log with root-cause categories and shipped improvements."]]),
  detail("atlas/traffic-report/index.html", "Atlas", "AISci Traffic Report | AISci.fans", "Atlas traffic reporting summarizes AISci.fans visitors, page views, referrers, and daily growth actions.", "Atlas Detail", "Traffic report", "A daily operating report for whether the site is earning attention.", [["Schedule", "09:10 JST"], ["Source", "Vercel Analytics"], ["Window", "30 days"]], ["Report yesterday and last 7 days visitors, page views, bounce rate, top pages, referrers, countries, and devices.", "Connect analytics to one concrete SEO or product action each day.", "Do not invent numbers when dashboard access is blocked."], [["Data source", "Vercel Web Analytics on the Hobby plan: 50,000 included monthly events and 30 days viewable history."], ["Growth loop", "Traffic report should feed homepage copy, SEO pages, distribution experiments, and daily Atlas backlog."], ["Next build", "Export analytics into a persistent weekly growth log."]]),
];

function detail(path, active, title, description, kicker, h1, lead, stats, bullets, blocks) {
  return { path, active, title, description, kicker, h1, lead, stats, bullets, blocks, detail: true };
}

function navHtml(active) {
  return nav
    .map(([label, href]) => `<a href="${href}"${label === active ? ' class="active"' : ""}>${label}</a>`)
    .join("");
}

function statsHtml(stats) {
  return stats
    .map(([value, label]) => `<div><strong>${value}</strong><span>${label}</span></div>`)
    .join("");
}

function cardsHtml(cards = []) {
  return cards
    .map(
      (card) => `<a class="entity-card" href="${card.href}">
        <span>${card.meta}</span>
        <h2>${card.title}</h2>
        <p>${card.body}</p>
      </a>`,
    )
    .join("");
}

function sectionsHtml(page) {
  if (page.detail) {
    return `<section class="detail-layout">
      <article class="detail-main">
        <h2>Operating agenda</h2>
        <ul class="check-list">${page.bullets.map((item) => `<li>${item}</li>`).join("")}</ul>
      </article>
      <aside class="detail-side">
        ${page.blocks
          .map(([title, body]) => `<div class="detail-box"><strong>${title}</strong><p>${body}</p></div>`)
          .join("")}
      </aside>
    </section>`;
  }

  return `${page.cards?.length ? `<section class="entity-grid">${cardsHtml(page.cards)}</section>` : ""}
    ${(page.sections || [])
      .map(
        (section) => `<section class="content-band">
          <h2>${section.title}</h2>
          <ul class="check-list">${section.items.map((item) => `<li>${item}</li>`).join("")}</ul>
        </section>`,
      )
      .join("")}`;
}

function html(page) {
  const canonical = `${siteUrl}/${page.path.replace(/index\.html$/, "")}`;
  const ld = {
    "@context": "https://schema.org",
    "@type": page.detail ? "Article" : "CollectionPage",
    headline: page.h1,
    name: page.title,
    description: page.description,
    url: canonical,
    isPartOf: { "@type": "WebSite", name: "AISci.fans", url: siteUrl },
  };

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'none'; form-action 'self'; upgrade-insecure-requests" />
    <meta name="referrer" content="no-referrer" />
    <meta name="description" content="${page.description}" />
    <meta name="robots" content="index,follow" />
    <link rel="canonical" href="${canonical}" />
    <meta property="og:type" content="${page.detail ? "article" : "website"}" />
    <meta property="og:site_name" content="AISci.fans" />
    <meta property="og:title" content="${page.title}" />
    <meta property="og:description" content="${page.description}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:image" content="${siteUrl}/og-image.svg" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${page.title}" />
    <meta name="twitter:description" content="${page.description}" />
    <meta name="twitter:image" content="${siteUrl}/og-image.svg" />
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    <link rel="manifest" href="/site.webmanifest" />
    <title>${page.title}</title>
    <script type="application/ld+json">${JSON.stringify(ld)}</script>
    <link rel="stylesheet" href="/styles.css" />
  </head>
  <body>
    <div class="shell page-shell">
      <aside class="side-rail" aria-label="AISci navigation">
        <a class="brand" href="/" aria-label="AISci.fans home">
          <span class="brand-mark">A</span>
          <span><strong>AISci.fans</strong><small>Global Science OS</small></span>
        </a>
        <nav class="rail-nav" aria-label="Primary">${navHtml(page.active)}</nav>
        <div class="atlas-mini">
          <div class="agent-chip" aria-hidden="true">A</div>
          <p>Atlas Agent</p>
          <strong>08:30 JST daily</strong>
          <span>Scans science, product references, capital signals, traffic, and weak system loops.</span>
        </div>
      </aside>
      <main>
        <header class="topbar page-topbar">
          <a class="text-link" href="/">Home</a>
          <div class="top-actions">
            <a class="secondary-btn" href="/atlas/">Atlas</a>
            <a class="primary-btn" href="/talent/research-passport/">Create Passport</a>
          </div>
        </header>
        <section class="page-hero">
          <div class="eyebrow"><span>${page.kicker}</span><span>${page.active}</span></div>
          <h1>${page.h1}</h1>
          <p>${page.lead}</p>
          <div class="page-stats">${statsHtml(page.stats)}</div>
        </section>
        ${sectionsHtml(page)}
      </main>
    </div>
    <script src="/analytics.js"></script>
    <script defer src="/_vercel/insights/script.js"></script>
  </body>
</html>`;
}

async function writePage(page) {
  const target = join(root, page.path);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, html(page));
}

function sitemap() {
  const urls = ["index.html", ...pages.map((page) => page.path), ...detailPages.map((page) => page.path)]
    .map((path) => `${siteUrl}/${path.replace(/index\.html$/, "")}`);
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${url}</loc>
    <lastmod>2026-05-21</lastmod>
    <changefreq>${url === `${siteUrl}/` ? "daily" : "weekly"}</changefreq>
    <priority>${url === `${siteUrl}/` ? "1.0" : "0.8"}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>
`;
}

for (const page of [...pages, ...detailPages]) {
  await writePage(page);
}
await writeFile(join(root, "sitemap.xml"), sitemap());
