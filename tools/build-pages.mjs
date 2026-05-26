import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const siteUrl = "https://aisci.fans";
const lastmod = "2026-05-26";

const nav = [
  ["Problems", "/problems/"],
  ["Talent", "/talent/"],
  ["Labs", "/labs/"],
  ["Capital", "/capital/"],
  ["Atlas", "/atlas/"],
];

const extraPaths = ["scientists/index.html"];

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
          "Launch readiness check against 2026-06-01.",
          "Self-improvement log with root cause and exact patch recommendation.",
        ],
      },
    ],
  },
];

const problemDetails = [
  {
    slug: "frontier-ai-audit",
    title: "Frontier AI Audit Stack",
    metaTitle: "Frontier AI Audit Stack: Evaluations, Monitoring, Red Teaming | AISci.fans",
    metaDescription:
      "Track the open problem of frontier AI audit: evaluations, monitoring, red-team evidence, governance trails, key institutions, sources, and proof-of-work tasks.",
    h1: "How can frontier AI systems be audited before deployment?",
    lead:
      "Frontier AI audit is the work of turning safety claims into evidence: tests that resist gaming, monitoring that catches capability shifts, red-team findings that become repeatable, and governance trails that independent experts can inspect.",
    domain: "AI Safety",
    score: "98",
    nextProof: "Anti-gaming eval suite",
    keywords: [
      "frontier AI audit",
      "AI safety evaluations",
      "model monitoring",
      "red teaming",
      "AI governance",
      "independent model audit",
    ],
    searchIntent:
      "This page answers searches about how frontier AI systems should be evaluated, monitored, red-teamed, and reviewed before deployment.",
    whyNow: [
      "Frontier models are entering enterprise, software engineering, education, media, and public workflows faster than independent audit standards can mature.",
      "Static benchmarks are not enough because models can be optimized for known tests while failing under novel, adversarial, or long-horizon conditions.",
      "Governments, labs, and enterprises need an evidence format that connects evals, incident reports, capability monitoring, and deployment decisions.",
    ],
    progress: [
      "AI risk management frameworks have moved the conversation from abstract principles toward measurement, governance, and documentation.",
      "Specialist eval labs and AI safety institutes are building test methods for dangerous capabilities, deception, autonomy, cyber misuse, and deployment risk.",
      "The strongest next step is a public audit trail format that lets independent reviewers compare model cards, eval logs, red-team reports, and post-deployment incidents.",
    ],
    bottlenecks: [
      "Capability tests can be gamed or become stale once they are public.",
      "Independent auditors often lack access to model internals, deployment telemetry, or enough time with the system.",
      "Organizations need a shared language for severity, confidence, residual risk, and go/no-go thresholds.",
    ],
    people: [
      "UK AI Security Institute and related national AI safety institutes.",
      "METR, ARC Evals, independent evaluation teams, and frontier model safety groups.",
      "Governance researchers, enterprise risk teams, and security engineers who can convert abstract risks into operational checks.",
    ],
    proofTasks: [
      "Replicate a published model evaluation and document where results are fragile.",
      "Design one anti-gaming benchmark for a narrow capability such as tool use, cyber reasoning, or long-horizon planning.",
      "Create an audit evidence template that links prompts, model outputs, scoring rubrics, reviewer notes, and uncertainty.",
    ],
    commercialization: [
      "Independent model audit services for enterprises adopting frontier AI.",
      "Continuous monitoring infrastructure for deployed agents and copilots.",
      "Compliance tooling that maps internal AI usage to auditable controls and evidence trails.",
    ],
    sourceLinks: [
      ["NIST AI Risk Management Framework", "https://www.nist.gov/itl/ai-risk-management-framework"],
      ["UK AI Security Institute", "https://www.aisi.gov.uk/"],
      ["METR evaluations research", "https://metr.org/"],
    ],
    faqs: [
      ["What is frontier AI audit?", "It is the practice of testing and documenting whether advanced AI systems meet explicit safety, reliability, monitoring, and governance standards before and after deployment."],
      ["Why are normal benchmarks not enough?", "Normal benchmarks can become stale, narrow, or optimized against. Frontier audit needs adversarial testing, deployment monitoring, incident review, and expert judgment."],
      ["How can young researchers contribute?", "They can reproduce evals, find failure cases, build benchmark tasks, write threat models, and create source-linked audit templates."],
    ],
  },
  {
    slug: "reproducible-ai-science",
    title: "Reproducible AI Science",
    metaTitle: "Reproducible AI Science: Research Agents, Provenance, Replication | AISci.fans",
    metaDescription:
      "A living guide to reproducible AI-assisted science: provenance, code, data, negative results, agent workflows, review loops, and proof-of-work tasks.",
    h1: "How can AI accelerate discovery without making science less reproducible?",
    lead:
      "AI can multiply scientific output, but speed without provenance creates noise. The core problem is to make every AI-assisted claim traceable to sources, code, data, failed attempts, uncertainty, and independent review.",
    domain: "Research Agents",
    score: "96",
    nextProof: "Source-grounded benchmark",
    keywords: [
      "reproducible AI science",
      "AI research agents",
      "scientific provenance",
      "open science",
      "replication crisis",
      "AI for science workflow",
    ],
    searchIntent:
      "This page answers searches about using AI research agents while preserving reproducibility, replication, source trails, and scientific trust.",
    whyNow: [
      "Research agents can read papers, generate hypotheses, write code, and suggest experiments, but they often hide failed paths and weak assumptions.",
      "Scientific communities already face reproducibility pressure; AI can either worsen the problem or become the infrastructure that fixes it.",
      "A useful science OS must reward negative results, executable artifacts, and evidence quality instead of only polished summaries.",
    ],
    progress: [
      "Open science principles have created a stronger norm around accessible data, transparent methods, and shared research objects.",
      "AI research-agent labs are beginning to move from summarization toward executable experiments, literature mapping, and automated review support.",
      "The missing layer is a standard evidence object: claim, source trail, code, data, environment, reviewer, uncertainty, and replication status.",
    ],
    bottlenecks: [
      "Agents can produce fluent text without enough source grounding.",
      "Many scientific workflows do not capture failed attempts, environment details, or reviewer disagreement.",
      "Research incentives still over-reward novelty and under-reward replication, maintenance, and careful negative evidence.",
    ],
    people: [
      "Open science communities, journal reproducibility editors, and data stewards.",
      "AI-for-science groups building research agents, lab assistants, and scientific copilots.",
      "Young researchers who can turn papers into executable notebooks, replication reports, and benchmark suites.",
    ],
    proofTasks: [
      "Turn one important paper into a reproducible notebook with exact data, environment, and run instructions.",
      "Audit an AI-generated literature review for unsupported claims and missing negative evidence.",
      "Design a benchmark where agents must produce executable experiments, not only natural-language answers.",
    ],
    commercialization: [
      "Research operating systems for pharma, materials, climate, and academic labs.",
      "Automated diligence tools for investors and research funders.",
      "Provenance infrastructure for journals, reviewers, and enterprise R&D teams.",
    ],
    sourceLinks: [
      ["UNESCO Open Science", "https://www.unesco.org/en/open-science"],
      ["National Academies report on reproducibility", "https://nap.nationalacademies.org/catalog/25303/reproducibility-and-replicability-in-science"],
      ["The Turing Way reproducible research guide", "https://the-turing-way.netlify.app/"],
    ],
    faqs: [
      ["What does reproducible AI science mean?", "It means AI-assisted work can be checked by another person or system because sources, code, data, assumptions, and uncertainty are preserved."],
      ["What should an AI research agent output?", "At minimum: claim, source links, method, code or protocol, failed attempts, confidence, uncertainty, and replication status."],
      ["Why is this a startup opportunity?", "Every serious R&D organization needs faster discovery, but regulated and high-stakes domains also need traceable evidence and review workflows."],
    ],
  },
  {
    slug: "validated-ai-medicine",
    title: "Validated AI Medicine",
    metaTitle: "Validated AI Medicine: AI Drug Discovery, Proteins, Wet-Lab Evidence | AISci.fans",
    metaDescription:
      "Track AI medicine from model score to real validation: protein design, drug discovery, wet-lab assays, toxicity, manufacturability, clinical relevance, and key sources.",
    h1: "How can AI-designed proteins and medicines become validated therapies?",
    lead:
      "AI biology has produced powerful design and prediction tools. The hard problem is validation: showing that a molecule, protein, or model result survives binding, stability, toxicity, manufacturability, clinical, and regulatory constraints.",
    domain: "AI Biology",
    score: "95",
    nextProof: "Wet-lab benchmark",
    keywords: [
      "AI drug discovery",
      "validated AI medicine",
      "protein design validation",
      "wet lab benchmark",
      "AI biology",
      "clinical translation",
    ],
    searchIntent:
      "This page answers searches about the gap between AI-designed molecules or proteins and real medical validation.",
    whyNow: [
      "Biological foundation models and protein-design tools have improved rapidly, but clinical value depends on real-world experimental evidence.",
      "Investors and labs need to separate model novelty from validated assets that can become therapies, diagnostics, or platform companies.",
      "The best young talent can contribute by building assay maps, failure-case libraries, and reproducible comparisons across tools.",
    ],
    progress: [
      "Protein structure prediction and design tooling has created a stronger base layer for target understanding and molecule generation.",
      "AI-native biotech companies are testing design loops that connect models, assays, automation, and translational strategy.",
      "The strongest pages in this problem area should track evidence by assay type, disease context, failure mode, and validation stage.",
    ],
    bottlenecks: [
      "Model scores often diverge from wet-lab behavior and clinical relevance.",
      "Data quality varies across assays, disease areas, and experimental contexts.",
      "Regulatory, manufacturing, toxicity, and delivery constraints can kill technically elegant candidates.",
    ],
    people: [
      "Protein design labs, translational biology teams, AI-native biotech founders, and automated assay groups.",
      "Clinical scientists who understand what evidence changes medical practice.",
      "Young researchers with strong biology plus code who can compare models against real assay outcomes.",
    ],
    proofTasks: [
      "Build a failure-case library for one AI biology task where model score and assay result diverge.",
      "Create a source-linked map of target, modality, assay, validation stage, and clinical constraint.",
      "Replicate a public protein design or generative chemistry benchmark and write a limitation memo.",
    ],
    commercialization: [
      "Platform biotech companies with proprietary validation loops.",
      "Automated CRO or assay-infrastructure companies.",
      "Disease-specific startups where model advantage connects to a narrow, measurable biological bottleneck.",
    ],
    sourceLinks: [
      ["FDA AI and machine learning software resources", "https://www.fda.gov/medical-devices/software-medical-device-samd/artificial-intelligence-and-machine-learning-software-medical-device"],
      ["AlphaFold Protein Structure Database", "https://alphafold.ebi.ac.uk/"],
      ["NIH Bridge2AI program", "https://commonfund.nih.gov/bridge2ai"],
    ],
    faqs: [
      ["Why is validation the bottleneck in AI medicine?", "Because a model can rank or generate candidates that look strong computationally but fail in assays, delivery, toxicity, manufacturing, or clinical relevance."],
      ["What evidence matters most?", "Assay outcomes, failure cases, reproducible protocols, disease context, safety constraints, and a clear path from model result to clinical decision."],
      ["Can AISci help form companies here?", "Yes, if the problem page can identify a narrow validated bottleneck, a credible scientific lead, proof-of-work talent, and a capital path."],
    ],
  },
  {
    slug: "pandemic-early-warning",
    title: "Pandemic Early Warning",
    metaTitle: "Pandemic Early Warning: Wastewater, Genomics, Animal Signals, AI Triage | AISci.fans",
    metaDescription:
      "Map pandemic early-warning systems: wastewater surveillance, genomic sequencing, animal signals, clinical data, AI triage, public-health response, and proof tasks.",
    h1: "How can the world detect and stop the next pandemic before it spreads?",
    lead:
      "Pandemic early warning is a data-integration and response problem. Wastewater, sequencing, animal surveillance, clinical signals, and AI triage only matter if they become trusted alerts that trigger action early enough.",
    domain: "Public Health",
    score: "94",
    nextProof: "Cross-signal dashboard",
    keywords: [
      "pandemic early warning",
      "wastewater surveillance",
      "genomic surveillance",
      "pathogen intelligence",
      "outbreak detection",
      "AI public health",
    ],
    searchIntent:
      "This page answers searches about how pathogen surveillance, wastewater data, genomic sequencing, and AI can support earlier outbreak detection.",
    whyNow: [
      "The world has more sequencing, wastewater, and clinical data than before, but the signals remain fragmented across institutions and borders.",
      "Early warnings must be interpretable enough for public-health teams, not only interesting to data scientists.",
      "AISci should focus on safe, high-level surveillance and response workflows, not operational biological misuse instructions.",
    ],
    progress: [
      "Public-health agencies and global networks have built stronger pathogen intelligence capabilities since COVID-19.",
      "Wastewater monitoring has become a practical signal for population-level pathogen trends.",
      "AI can help triage noisy signals, but the hard part remains source quality, incentives, governance, and response speed.",
    ],
    bottlenecks: [
      "Data access and incentives differ across countries, labs, hospitals, and animal surveillance systems.",
      "False positives and false negatives can create either panic or dangerous delay.",
      "Response workflows often lag behind signal detection.",
    ],
    people: [
      "WHO pandemic intelligence networks, national public-health agencies, sequencing labs, wastewater monitoring groups, and epidemiologists.",
      "Data scientists who can build transparent uncertainty models for cross-signal dashboards.",
      "Policy and operations leaders who can turn alerts into public-health action.",
    ],
    proofTasks: [
      "Create a non-sensitive dashboard design that shows signal type, source quality, uncertainty, and response status.",
      "Write a case study comparing how wastewater, genomic, and clinical signals changed during one past outbreak.",
      "Build an outbreak-analysis notebook using only public, safe, aggregated data.",
    ],
    commercialization: [
      "Biosurveillance software for public-health agencies and health systems.",
      "Diagnostics and sample logistics infrastructure.",
      "Decision-support tools that connect surveillance signals to operational response plans.",
    ],
    sourceLinks: [
      ["WHO Hub for Pandemic and Epidemic Intelligence", "https://pandemichub.who.int/"],
      ["CDC National Wastewater Surveillance System", "https://www.cdc.gov/nwss/"],
      ["GISAID pathogen data initiative", "https://gisaid.org/"],
    ],
    faqs: [
      ["What signals matter for pandemic early warning?", "Wastewater, genomic sequencing, animal health, clinical symptoms, diagnostic testing, travel context, and trusted local reporting can all matter."],
      ["What should AISci avoid in this area?", "AISci should avoid dangerous biological protocols, patient-level medical advice, and sensitive operational details that could create misuse or legal risk."],
      ["Where can young researchers help?", "They can work on public-data analysis, uncertainty visualization, safe dashboard design, and historical outbreak case studies."],
    ],
  },
  {
    slug: "antimicrobial-resistance",
    title: "Antimicrobial Resistance Response",
    metaTitle: "Antimicrobial Resistance: Diagnostics, Drugs, Vaccines, Stewardship | AISci.fans",
    metaDescription:
      "Track antimicrobial resistance research: rapid diagnostics, new drugs, phage and vaccine approaches, stewardship, hospital decision support, sources, and talent tasks.",
    h1: "How can humanity beat antimicrobial resistance with diagnostics, drugs, vaccines, and stewardship?",
    lead:
      "Antimicrobial resistance is a slow-moving global crisis. The solution is not one miracle antibiotic; it is a system of rapid diagnostics, new modalities, vaccines, stewardship, incentives, and hospital decision support.",
    domain: "Bio / Health",
    score: "93",
    nextProof: "Rapid diagnostic workflow",
    keywords: [
      "antimicrobial resistance",
      "AMR diagnostics",
      "antibiotic resistance",
      "phage therapy",
      "antibiotic stewardship",
      "drug-resistant infections",
    ],
    searchIntent:
      "This page answers searches about AMR research progress, diagnostic gaps, new therapies, stewardship, and commercialization paths.",
    whyNow: [
      "Drug-resistant infections already create major health and economic costs, while antibiotic business models remain difficult.",
      "Faster diagnostics can change prescribing behavior, but only if they fit clinical workflows.",
      "AMR is a strong AISci problem because it needs biology, medicine, data systems, incentives, and capital design at once.",
    ],
    progress: [
      "Global health organizations have made AMR a priority area with surveillance, stewardship, and incentive discussions.",
      "New approaches include rapid diagnostics, phage platforms, narrow-spectrum drugs, vaccines, and microbiome-aware interventions.",
      "The next useful map should connect pathogen, resistance mechanism, diagnostic method, therapy class, clinical workflow, and incentive model.",
    ],
    bottlenecks: [
      "Reserve antibiotics need limited use, but companies need sustainable returns.",
      "Hospitals need rapid tests that are accurate, affordable, and actionable within treatment windows.",
      "Surveillance data, stewardship behavior, and reimbursement incentives are uneven across regions.",
    ],
    people: [
      "WHO AMR programs, CARB-X, Wellcome, CDC teams, hospital stewardship experts, and antibiotic discovery labs.",
      "Microbiologists, diagnostic engineers, infectious-disease clinicians, and health economists.",
      "Young researchers who can mine resistance datasets and evaluate diagnostic decision workflows.",
    ],
    proofTasks: [
      "Map one pathogen-resistance pair from surveillance data to diagnostic options and treatment workflow.",
      "Write a decision-support memo for when rapid diagnostics would change antibiotic prescribing.",
      "Compare one AMR startup thesis against clinical adoption, reimbursement, and stewardship constraints.",
    ],
    commercialization: [
      "Rapid diagnostic platforms and hospital decision software.",
      "Phage, vaccine, or narrow-spectrum therapeutic companies.",
      "Surveillance and stewardship infrastructure for health systems and public-health agencies.",
    ],
    sourceLinks: [
      ["WHO antimicrobial resistance topic", "https://www.who.int/health-topics/antimicrobial-resistance"],
      ["CARB-X antibacterial accelerator", "https://carb-x.org/"],
      ["CDC antimicrobial resistance", "https://www.cdc.gov/antimicrobial-resistance/"],
    ],
    faqs: [
      ["Why is AMR difficult to commercialize?", "The best public-health use of reserve antibiotics can mean limited sales, so incentives, reimbursement, and stewardship must be designed carefully."],
      ["What is the fastest proof-of-work task?", "Pick one infection workflow and show where a faster diagnostic would change the clinical decision."],
      ["Is this only a drug-discovery problem?", "No. Diagnostics, hospital software, surveillance, vaccines, stewardship, and incentives are equally important."],
    ],
  },
  {
    slug: "autonomous-climate-materials",
    title: "Autonomous Climate Materials",
    metaTitle: "Autonomous Climate Materials: Self-Driving Labs, Batteries, Catalysts | AISci.fans",
    metaDescription:
      "Map autonomous climate materials research: self-driving labs, batteries, catalysts, semiconductors, carbon capture, failed-result datasets, and capital paths.",
    h1: "Can autonomous labs discover batteries, catalysts, chips, and climate materials fast enough?",
    lead:
      "Climate and compute infrastructure need better materials. Autonomous labs promise faster discovery loops, but only if prediction, synthesis, robotics, testing, failed-result capture, and economics become one workflow.",
    domain: "Energy / Materials",
    score: "96",
    nextProof: "Closed-loop lab demo",
    keywords: [
      "autonomous materials discovery",
      "self-driving labs",
      "battery materials",
      "catalyst discovery",
      "climate materials",
      "robotic chemistry",
    ],
    searchIntent:
      "This page answers searches about self-driving laboratories, AI materials discovery, climate-critical materials, and automation bottlenecks.",
    whyNow: [
      "Batteries, catalysts, semiconductors, carbon capture, and critical-mineral systems are all materials-constrained.",
      "AI can propose candidates, but synthesis feasibility and experimental feedback determine whether discovery speed actually improves.",
      "A useful problem page must connect scientific novelty to equipment constraints, data standards, and first commercial markets.",
    ],
    progress: [
      "Open materials databases and simulation tools have made candidate discovery more accessible.",
      "Self-driving lab demonstrations show that closed-loop prediction, synthesis, and testing can compress iteration cycles.",
      "The next frontier is standardizing failed-result data, robot-compatible protocols, and property-measurement benchmarks.",
    ],
    bottlenecks: [
      "Many predicted materials are hard to synthesize or unstable in real conditions.",
      "Robotic lab setups vary widely, making protocols hard to transfer.",
      "Failed experiments are valuable but often unpublished, unstructured, or missing metadata.",
    ],
    people: [
      "Materials Project contributors, national lab materials scientists, robotic chemistry groups, and battery or catalyst researchers.",
      "Automation engineers who understand real equipment constraints.",
      "Young researchers who can clean datasets, compare synthesis routes, and write property-specific evidence maps.",
    ],
    proofTasks: [
      "Pick one material class and map candidate, synthesis route, property target, measurement method, and failure mode.",
      "Create a failed-result schema for a self-driving lab workflow.",
      "Write a capital memo for one materials bottleneck where faster discovery could create a company.",
    ],
    commercialization: [
      "Battery and catalyst discovery companies.",
      "Materials data infrastructure and lab automation software.",
      "Vertical foundries for semiconductors, carbon capture, critical minerals, or industrial decarbonization.",
    ],
    sourceLinks: [
      ["Materials Project", "https://materialsproject.org/"],
      ["DOE Basic Energy Sciences", "https://science.osti.gov/bes"],
      ["NREL materials science", "https://www.nrel.gov/materials-science/"],
    ],
    faqs: [
      ["What is an autonomous materials lab?", "It is a closed-loop system that predicts candidates, runs experiments, measures results, learns from failures, and decides the next experiment."],
      ["Why do failed results matter?", "They teach models what does not work and prevent repeated dead ends, but they need structure, metadata, and incentives to be useful."],
      ["Where is the startup opportunity?", "In domain-specific discovery loops where better materials directly unlock a high-value market such as batteries, catalysts, or semiconductors."],
    ],
  },
  {
    slug: "clean-power-ai-grid",
    title: "Clean Power for AI and Electrification",
    metaTitle: "Clean Power for AI: Grids, Storage, Data Centers, Critical Minerals | AISci.fans",
    metaDescription:
      "Track clean power for AI and electrification: grid bottlenecks, storage, data centers, transmission, critical minerals, demand response, and source links.",
    h1: "How can clean power, grids, storage, and critical minerals support AI and electrification?",
    lead:
      "AI data centers, electric transport, heat pumps, industry, and advanced manufacturing are increasing electricity demand. The bottleneck is not only generation; it is grids, interconnection, storage, flexibility, permitting, and minerals.",
    domain: "Energy",
    score: "95",
    nextProof: "Grid bottleneck map",
    keywords: [
      "clean power for AI",
      "AI data center electricity",
      "grid bottlenecks",
      "long-duration storage",
      "critical minerals",
      "electrification",
    ],
    searchIntent:
      "This page answers searches about AI energy demand, grid capacity, storage, critical minerals, and infrastructure opportunities.",
    whyNow: [
      "Electricity demand is rising from AI, data centers, electric vehicles, cooling, heat, and industrial electrification.",
      "Data centers create concentrated loads that can stress local grids faster than transmission and interconnection processes can respond.",
      "The winning companies may be in grid software, storage, demand response, generation services, or mineral processing, not only AI hardware.",
    ],
    progress: [
      "IEA analysis shows electricity demand and grid investment needs are central infrastructure questions through 2030.",
      "Utilities, data-center operators, and energy developers are experimenting with co-location, flexible demand, new storage, and faster interconnection.",
      "The next useful map should rank regions by power availability, queue time, storage need, carbon intensity, and regulatory constraint.",
    ],
    bottlenecks: [
      "Transmission and interconnection timelines can be slower than data-center build timelines.",
      "Long-duration storage, flexible demand, and dispatchable clean power remain hard to scale.",
      "Critical minerals and equipment supply chains create hidden deployment constraints.",
    ],
    people: [
      "IEA analysts, national labs, grid modelers, utility planners, storage researchers, data-center infrastructure teams, and mineral supply-chain experts.",
      "Young analysts who can combine public queue data, load forecasts, and siting constraints.",
      "Founders who can sell into utility, data-center, and industrial energy workflows.",
    ],
    proofTasks: [
      "Build a public grid-bottleneck map for one region: load growth, interconnection queue, transmission constraint, and storage need.",
      "Compare three data-center power strategies by cost, speed, reliability, and emissions.",
      "Write a one-page startup thesis for one grid or storage bottleneck with a first buyer profile.",
    ],
    commercialization: [
      "Grid-planning and interconnection software.",
      "Long-duration storage, geothermal, nuclear services, and flexible load orchestration.",
      "Critical-mineral processing, recycling, and supply-chain intelligence.",
    ],
    sourceLinks: [
      ["IEA Electricity 2026", "https://www.iea.org/reports/electricity-2026"],
      ["IEA Electricity 2026 grids chapter", "https://www.iea.org/reports/electricity-2026/grids"],
      ["NREL grid modernization", "https://www.nrel.gov/grid/"],
    ],
    faqs: [
      ["Why does AI create a power problem?", "AI data centers can add large, concentrated electricity loads quickly, which can stress local grids, interconnection timelines, and generation planning."],
      ["Is the answer just more renewable generation?", "No. Generation helps, but grids, storage, flexibility, permitting, critical minerals, and reliability all matter."],
      ["What can young researchers analyze?", "They can map public queue data, regional load growth, storage economics, and siting constraints into decision-ready memos."],
    ],
  },
  {
    slug: "resilient-food-systems",
    title: "Resilient Food Systems",
    metaTitle: "Resilient Food Systems: Nitrogen, Water, Soil Carbon, Food Security | AISci.fans",
    metaDescription:
      "Map resilient food systems research: nitrogen efficiency, water stress, soil carbon, crop resilience, field trials, farmer incentives, and commercialization paths.",
    h1: "How can agriculture fix nitrogen, water stress, and soil carbon while protecting food security?",
    lead:
      "Food systems must produce reliably under climate, water, soil, and input pressure. The scientific problem is tied to farmer economics: better biology or data only matters if it works in the field and fits incentives.",
    domain: "Food / Climate",
    score: "91",
    nextProof: "Field-trial evidence map",
    keywords: [
      "resilient food systems",
      "nitrogen efficiency",
      "water stress agriculture",
      "soil carbon measurement",
      "crop resilience",
      "climate smart agriculture",
    ],
    searchIntent:
      "This page answers searches about climate-resilient agriculture, nitrogen, water stress, soil carbon, and field-trial evidence.",
    whyNow: [
      "Climate volatility, fertilizer costs, water scarcity, and food security are now linked operational problems.",
      "Biological inputs, crop genetics, irrigation, and soil measurement are improving, but adoption depends on field evidence and economics.",
      "AISci can help by turning scattered studies into problem-specific evidence maps and proof tasks for young researchers.",
    ],
    progress: [
      "Climate-smart agriculture and crop-resilience programs have created a broader language for adaptation, productivity, and sustainability.",
      "Better remote sensing, field-trial data, and soil measurement tools are making agriculture more measurable.",
      "The next frontier is comparing interventions under real farmer constraints rather than idealized trial settings.",
    ],
    bottlenecks: [
      "Field variability makes results hard to generalize across soil, crop, region, and season.",
      "Farmers need clear ROI, operational simplicity, and risk protection.",
      "Soil carbon and nitrogen outcomes are hard to measure cheaply and reliably.",
    ],
    people: [
      "FAO, CGIAR, plant-science labs, soil scientists, irrigation researchers, ag biotech teams, and farmer-facing operators.",
      "Young researchers who can analyze field trials, remote-sensing data, and farmer economics together.",
      "Company builders who understand distribution through farms, cooperatives, food buyers, and insurers.",
    ],
    proofTasks: [
      "Build an evidence map for one crop and one intervention across yield, water, nitrogen, soil, cost, and adoption friction.",
      "Compare soil-carbon measurement methods for reliability, cost, and farmer usability.",
      "Write a farmer-first memo explaining when a biological input or irrigation tool is worth adopting.",
    ],
    commercialization: [
      "Biological inputs, crop resilience, precision irrigation, and soil measurement.",
      "Farm decision-support software tied to weather, input cost, and field evidence.",
      "Risk and insurance products that reward measurable resilience improvements.",
    ],
    sourceLinks: [
      ["FAO climate-smart agriculture", "https://www.fao.org/climate-smart-agriculture/en/"],
      ["CGIAR research network", "https://www.cgiar.org/"],
      ["IPCC Sixth Assessment Report", "https://www.ipcc.ch/assessment-report/ar6/"],
    ],
    faqs: [
      ["Why is field evidence so important?", "Agricultural results vary by soil, weather, region, crop, and farmer practice, so lab or small-trial claims need field validation."],
      ["What makes this interdisciplinary?", "It combines biology, climate, water, soil science, economics, logistics, insurance, and farmer behavior."],
      ["Where can AISci create value?", "By mapping which interventions work where, what evidence is missing, and which young researchers can contribute replication or field-data analysis."],
    ],
  },
  {
    slug: "robotic-science-work",
    title: "Robotic Science Work",
    metaTitle: "Robotic Science Work: Lab Automation, Embodied AI, Reliable Protocols | AISci.fans",
    metaDescription:
      "Track robots as research assistants: lab automation, embodied AI, long-horizon reliability, protocol execution, safety, evaluation, and startup opportunities.",
    h1: "How can robots become safe, reliable research assistants in real physical environments?",
    lead:
      "Robotic science work means moving from demos to dependable protocol execution. A useful research robot must observe, manipulate, correct mistakes, log evidence, and operate safely around humans and fragile equipment.",
    domain: "Automation",
    score: "90",
    nextProof: "Long-horizon task benchmark",
    keywords: [
      "robotic science work",
      "lab automation",
      "embodied AI research",
      "robot scientist",
      "long-horizon robotics",
      "scientific protocol automation",
    ],
    searchIntent:
      "This page answers searches about lab robots, embodied AI, long-horizon reliability, and research protocol automation.",
    whyNow: [
      "Scientific labs need more throughput, reproducibility, and labor leverage, but many protocols still depend on human dexterity and judgment.",
      "Robotics and multimodal AI are improving, yet real lab work requires reliability, calibration, safety, and detailed evidence logs.",
      "AISci can turn this into tractable tasks: protocol decomposition, benchmark design, failure taxonomy, and human-in-the-loop workflows.",
    ],
    progress: [
      "Lab automation already works well in constrained environments such as liquid handling, screening, and standardized assays.",
      "Embodied AI research is improving perception, manipulation, and task planning.",
      "The hard frontier is generalizing across variable equipment, materials, protocols, and recovery from small physical errors.",
    ],
    bottlenecks: [
      "Long-horizon tasks fail when small errors compound.",
      "Hardware variation makes a protocol that works in one lab fail in another.",
      "Safety, contamination control, and evidence logging are non-negotiable in scientific environments.",
    ],
    people: [
      "Robotics labs, lab-automation companies, NIST robotics researchers, autonomous chemistry groups, and protocol-heavy biology labs.",
      "Young researchers who can turn messy protocols into structured robot tasks and failure labels.",
      "Operators who understand procurement, maintenance, safety, and lab workflow adoption.",
    ],
    proofTasks: [
      "Break one lab protocol into robot-readable steps, observations, failure modes, and recovery actions.",
      "Design a benchmark for long-horizon task success in a constrained research workflow.",
      "Write a failure taxonomy for one class of lab automation errors and how logs should capture them.",
    ],
    commercialization: [
      "Vertical lab automation hardware for high-value workflows.",
      "Robot software for protocol planning, perception, logging, and human review.",
      "Research services that combine robotics, expert oversight, and reproducible evidence packages.",
    ],
    sourceLinks: [
      ["NIST robotics", "https://www.nist.gov/robotics"],
      ["NIST Intelligent Systems Division", "https://www.nist.gov/nist-organizations/nist-headquarters/laboratory-programs/engineering-laboratory/intelligent-3"],
      ["Nature Machine Intelligence", "https://www.nature.com/natmachintell/"],
    ],
    faqs: [
      ["Why are lab robots still hard?", "Real labs contain variable tools, fragile samples, implicit human judgment, and safety constraints that make long-horizon reliability difficult."],
      ["What should be measured?", "Task success, error recovery, calibration drift, safety events, contamination risk, and quality of evidence logs."],
      ["How can students contribute?", "They can decompose protocols, label failures, build benchmarks, and write reproducible automation memos."],
    ],
  },
  {
    slug: "science-to-company",
    title: "Science-to-Company Pathways",
    metaTitle: "Science-to-Company Pathways: Deep Tech Translation, IP, Talent, Capital | AISci.fans",
    metaDescription:
      "Map how discoveries become companies: proof-of-work, virtual labs, IP posture, founder gaps, public-good boundaries, venture diligence, and formation workflows.",
    h1: "How can discoveries become companies without losing openness, trust, and global talent mobility?",
    lead:
      "Science-to-company translation is not just tech transfer. It is the full path from problem to proof, lab, company, capital, customers, and public benefit while preserving trust among scientists, students, investors, and institutions.",
    domain: "Institutions",
    score: "92",
    nextProof: "Formation workflow",
    keywords: [
      "science to company",
      "deep tech venture creation",
      "technology transfer",
      "research commercialization",
      "virtual labs",
      "scientist founder",
    ],
    searchIntent:
      "This page answers searches about commercializing scientific discoveries, forming deep-tech companies, and preserving openness and trust.",
    whyNow: [
      "Frontier science increasingly needs software, data, automation, and capital to become useful products.",
      "Universities, labs, students, founders, and investors each hold part of the path, but the workflow is fragmented.",
      "A science OS can make the path legible: what stays open, what becomes proprietary, who can build, what proof matters, and what risk must be reviewed.",
    ],
    progress: [
      "Tech-transfer offices, accelerators, venture studios, and translational institutes have created useful pieces of the formation stack.",
      "Deep-tech investors increasingly want stronger evidence before company formation or financing.",
      "The missing layer is a shared problem graph connecting open tasks, proof, scientists, young talent, IP posture, and capital readiness.",
    ],
    bottlenecks: [
      "IP ownership, publication timing, and confidentiality can conflict with open collaboration.",
      "Scientific founders often need company-building partners, regulatory help, and first-market discipline.",
      "Investors need honest uncertainty, not inflated claims or hidden technical risk.",
    ],
    people: [
      "University tech-transfer teams, NSF I-Corps mentors, NIH SEED resources, deep-tech accelerators, venture studios, and translational research institutes.",
      "Scientists with credible problem ownership and founders who can turn proof into product.",
      "Young talent whose public proof-of-work can make them visible before credentials catch up.",
    ],
    proofTasks: [
      "Create a formation memo for one problem: open proof, private asset, IP posture, founder gap, first customer, and next validation step.",
      "Map one lab's public research into possible company theses while marking what must remain confidential.",
      "Write a diligence checklist that separates scientific uncertainty, market risk, regulatory risk, and team risk.",
    ],
    commercialization: [
      "Virtual labs that produce validated company opportunities.",
      "Science diligence and expert-review infrastructure for VCs.",
      "Talent and founder matching around frontier research problems.",
    ],
    sourceLinks: [
      ["NSF I-Corps", "https://new.nsf.gov/funding/initiatives/i-corps"],
      ["NIH SEED", "https://seed.nih.gov/"],
      ["ARPA-H", "https://arpa-h.gov/"],
    ],
    faqs: [
      ["What should stay open?", "Generally, problem definitions, public benchmarks, educational tasks, and non-confidential proof can stay open; private datasets, patent-sensitive claims, and customer data need review."],
      ["Who reviews scientist claims and company formation risk?", "The MVP should use founder/admin review first, with expert reviewers added later for technical, legal, IP, and regulatory topics."],
      ["How does AISci help investors?", "It turns scientific bottlenecks into evidence maps, talent signals, risk memos, and next validation steps instead of generic hype."],
    ],
  },
];

const seoBriefs = [
  {
    slug: "ai-safety-audit-standards",
    problemSlug: "frontier-ai-audit",
    active: "Problems",
    title: "AI Safety Audit Standards: How to Evaluate Frontier Models Before Deployment | AISci.fans",
    description:
      "A practical AISci brief on frontier AI audit standards: evaluations, red-team evidence, continuous monitoring, incident review, model governance, and proof-of-work tasks.",
    kicker: "AISci Brief",
    h1: "AI safety audit standards should be evidence systems, not checklists.",
    lead:
      "Frontier model deployment needs a repeatable audit trail: what was tested, who reviewed it, what failed, what changed, and what residual risk remains after mitigation.",
    stats: [["Problem", "AI audit"], ["Users", "Labs + enterprises"], ["Output", "Audit evidence"]],
    keywords: [
      "AI safety audit standards",
      "frontier model evaluation",
      "AI red teaming",
      "model monitoring",
      "AI governance evidence",
      "independent AI audit",
    ],
    sections: [
      {
        title: "The search problem",
        body:
          "Most searches for AI safety audit standards are really asking for an operational answer: how can a lab, regulator, enterprise, or independent reviewer know whether a frontier AI system is safe enough to deploy in a specific context?",
      },
      {
        title: "What an audit standard needs to contain",
        items: [
          "A capability map: dangerous capabilities, autonomy, tool use, cyber behavior, persuasion, deception, long-horizon planning, and domain-specific failure modes.",
          "A test record: prompts, environments, scoring rubrics, model versions, evaluator identity, date, uncertainty, and known ways the test can be gamed.",
          "A monitoring plan: post-deployment telemetry, incident triggers, rollback criteria, escalation owners, and review cadence.",
          "A governance trail: who made the deployment decision, what evidence they saw, what risk was accepted, and what mitigations were required.",
        ],
      },
      {
        title: "Scientists and institutions AISci should keep mapping",
        items: [
          "AI safety institutes and independent evaluation organizations that can define reusable test methods.",
          "Model-evaluation researchers who study benchmark gaming, capability elicitation, and red-team methodology.",
          "Security engineers and enterprise risk leaders who can turn model behavior into deployable controls.",
        ],
      },
      {
        title: "Proof-of-work task for young researchers",
        body:
          "Pick one frontier AI capability, reproduce a public evaluation, document three ways the result can fail, and publish a short audit packet with source links, code, rubric, and confidence notes.",
      },
      {
        title: "Why capital should care",
        body:
          "Enterprise AI adoption creates demand for independent audits, continuous monitoring, compliance evidence, and incident response tooling. The strongest company opportunities will sell trust infrastructure, not generic safety language.",
      },
    ],
    sourceLinks: [
      ["Frontier AI Audit Stack problem page", "/problems/frontier-ai-audit/"],
      ["NIST AI Risk Management Framework", "https://www.nist.gov/itl/ai-risk-management-framework"],
      ["UK AI Security Institute", "https://www.aisi.gov.uk/"],
      ["METR evaluations research", "https://metr.org/"],
    ],
  },
  {
    slug: "reproducible-ai-research-agents",
    problemSlug: "reproducible-ai-science",
    active: "Problems",
    title: "Reproducible AI Research Agents: Provenance, Replication, Source Trails | AISci.fans",
    description:
      "A practical AISci brief on reproducible AI research agents: provenance, source-grounded claims, executable notebooks, negative results, and reviewable scientific workflows.",
    kicker: "AISci Brief",
    h1: "AI research agents need provenance before they need more polish.",
    lead:
      "Research agents can read, code, summarize, and propose experiments. The scientific value comes only when their outputs preserve sources, assumptions, failed attempts, data, code, and uncertainty.",
    stats: [["Problem", "Reproducibility"], ["Users", "Labs + reviewers"], ["Output", "Evidence objects"]],
    keywords: [
      "reproducible AI research agents",
      "AI for science provenance",
      "research agent workflow",
      "scientific source trails",
      "AI replication benchmark",
      "open science automation",
    ],
    sections: [
      {
        title: "The search problem",
        body:
          "People searching for reproducible AI research agents are not looking for another chatbot. They are looking for a way to make AI-generated scientific claims inspectable, executable, and reviewable by another researcher.",
      },
      {
        title: "What every agent output should preserve",
        items: [
          "Claim: the exact scientific statement or hypothesis, with uncertainty and scope.",
          "Evidence: source links, quoted methods, data provenance, and missing counter-evidence.",
          "Execution: notebook, code, environment, parameters, seeds, and run instructions.",
          "Failure log: rejected hypotheses, failed runs, negative evidence, and reviewer disagreement.",
        ],
      },
      {
        title: "Scientists and institutions AISci should keep mapping",
        items: [
          "Open-science communities and reproducibility editors who define review norms.",
          "AI-for-science teams building agents that run executable workflows instead of only summaries.",
          "Data stewards and benchmark builders who can convert messy research artifacts into durable evidence objects.",
        ],
      },
      {
        title: "Proof-of-work task for young researchers",
        body:
          "Choose one important AI-for-science paper and turn it into a reproducible packet: claim map, source list, executable notebook, environment file, failed-run notes, and a one-page limitation memo.",
      },
      {
        title: "Why capital should care",
        body:
          "Pharma, materials, climate, and enterprise R&D teams all want faster discovery, but regulated and high-stakes domains also need proof. The commercial wedge is provenance infrastructure for serious labs.",
      },
    ],
    sourceLinks: [
      ["Reproducible AI Science problem page", "/problems/reproducible-ai-science/"],
      ["UNESCO Open Science", "https://www.unesco.org/en/open-science"],
      ["National Academies report on reproducibility", "https://nap.nationalacademies.org/catalog/25303/reproducibility-and-replicability-in-science"],
      ["The Turing Way", "https://the-turing-way.netlify.app/"],
    ],
  },
  {
    slug: "autonomous-labs-materials-discovery",
    problemSlug: "autonomous-climate-materials",
    active: "Problems",
    title: "Autonomous Labs for Materials Discovery: Batteries, Catalysts, Climate Materials | AISci.fans",
    description:
      "A practical AISci brief on autonomous materials discovery: self-driving labs, battery materials, catalysts, failed-result datasets, robotic chemistry, and climate commercialization.",
    kicker: "AISci Brief",
    h1: "Autonomous labs will matter when they close the loop from prediction to synthesis.",
    lead:
      "AI can propose battery, catalyst, semiconductor, and carbon-capture materials. The bottleneck is whether synthesis, testing, failed-result capture, and economic relevance become one closed-loop workflow.",
    stats: [["Problem", "Materials"], ["Users", "Labs + founders"], ["Output", "Closed-loop evidence"]],
    keywords: [
      "autonomous labs materials discovery",
      "self-driving laboratory",
      "AI battery materials",
      "catalyst discovery",
      "robotic chemistry",
      "climate materials startup",
    ],
    sections: [
      {
        title: "The search problem",
        body:
          "Search demand around autonomous labs is split between science and company formation: which materials problems are urgent enough, measurable enough, and commercially valuable enough to justify closed-loop automation?",
      },
      {
        title: "What a useful autonomous lab loop contains",
        items: [
          "Prediction: candidate generation with property targets, uncertainty, and synthesis feasibility.",
          "Execution: robot-compatible protocols, reagent constraints, equipment state, and safety boundaries.",
          "Measurement: property-specific tests, metadata, calibration, repeatability, and failure classification.",
          "Learning: a dataset that includes failed attempts, not only successful candidates.",
        ],
      },
      {
        title: "Scientists and institutions AISci should keep mapping",
        items: [
          "Materials Project contributors and open materials database builders.",
          "Self-driving laboratory and robotic chemistry groups with real synthesis constraints.",
          "Battery, catalyst, semiconductor, and carbon-capture researchers who can define commercially meaningful property targets.",
        ],
      },
      {
        title: "Proof-of-work task for young researchers",
        body:
          "Pick one material class and publish a structured map of candidate, synthesis route, target property, measurement method, failure modes, and first commercial market.",
      },
      {
        title: "Why capital should care",
        body:
          "If a closed-loop lab shortens iteration cycles for a materials bottleneck tied to a large market, it can become a vertical foundry, data platform, or infrastructure company.",
      },
    ],
    sourceLinks: [
      ["Autonomous Climate Materials problem page", "/problems/autonomous-climate-materials/"],
      ["Materials Project", "https://materialsproject.org/"],
      ["DOE Basic Energy Sciences", "https://science.osti.gov/bes"],
      ["NREL materials science", "https://www.nrel.gov/materials-science/"],
    ],
  },
];

function briefsForProblem(problemSlug) {
  return seoBriefs.filter((brief) => brief.problemSlug === problemSlug);
}

const problemSeeds = {
  "frontier-ai-audit": {
    scientists: [
      ["Yoshua Bengio", "Mila / Universite de Montreal", "https://mila.quebec/en/person/yoshua-bengio/"],
      ["Dan Hendrycks", "Center for AI Safety", "https://www.safe.ai/team"],
      ["Beth Barnes", "METR", "https://metr.org/team/"],
      ["Paul Christiano", "Alignment Research Center", "https://alignment.org/"],
    ],
    papers: [
      ["Model evaluation for extreme risks", "2023", "Shevlane, Farquhar, Garfinkel et al.", "https://arxiv.org/abs/2305.15324"],
      ["Holistic Evaluation of Language Models", "2022", "Liang, Bommasani, Lee et al.", "https://arxiv.org/abs/2211.09110"],
      ["Measuring Massive Multitask Language Understanding", "2020", "Hendrycks, Burns, Basart et al.", "https://arxiv.org/abs/2009.03300"],
    ],
  },
  "reproducible-ai-science": {
    scientists: [
      ["Yolanda Gil", "USC / AI and scientific workflows", "https://viterbi.usc.edu/directory/faculty/Gil/Yolanda"],
      ["Marinka Zitnik", "Harvard / AI for science and medicine", "https://zitniklab.hms.harvard.edu/"],
      ["Alán Aspuru-Guzik", "University of Toronto / self-driving labs", "https://www.matter.toronto.edu/basic-content-page/alan-aspuru-guzik"],
      ["Ross D. King", "Robot scientist research", "https://researchers.anu.edu.au/researchers/king-rd"],
    ],
    papers: [
      ["The Turing Way: a handbook for reproducible, ethical and collaborative research", "2019", "The Turing Way Community", "https://doi.org/10.5281/zenodo.3233853"],
      ["Reproducibility and Replicability in Science", "2019", "National Academies of Sciences, Engineering, and Medicine", "https://nap.nationalacademies.org/catalog/25303/reproducibility-and-replicability-in-science"],
      ["Artificial intelligence for science in quantum, atomistic, and continuum systems", "2023", "Biamonte, et al.", "https://doi.org/10.1038/s41586-023-06264-2"],
    ],
  },
  "validated-ai-medicine": {
    scientists: [
      ["David Baker", "Institute for Protein Design", "https://www.ipd.uw.edu/"],
      ["John Jumper", "Google DeepMind / AlphaFold", "https://deepmind.google/discover/people/john-jumper/"],
      ["Demis Hassabis", "Google DeepMind / Isomorphic Labs", "https://deepmind.google/discover/people/demis-hassabis/"],
      ["Regina Barzilay", "MIT / AI for medicine", "https://people.csail.mit.edu/regina/"],
    ],
    papers: [
      ["Accurate structure prediction of biomolecular interactions with AlphaFold 3", "2024", "Abramson, Adler, Dunger et al.", "https://doi.org/10.1038/s41586-024-07487-w"],
      ["Highly accurate protein structure prediction with AlphaFold", "2021", "Jumper, Evans, Pritzel et al.", "https://doi.org/10.1038/s41586-021-03819-2"],
      ["De novo design of protein structure and function with RFdiffusion", "2023", "Watson, Juergens, Bennett et al.", "https://doi.org/10.1038/s41586-023-06415-8"],
    ],
  },
  "pandemic-early-warning": {
    scientists: [
      ["Pardis Sabeti", "Broad Institute / genomic surveillance", "https://www.broadinstitute.org/bios/pardis-sabeti"],
      ["Kristian Andersen", "Scripps Research / pathogen genomics", "https://www.scripps.edu/faculty/andersen/"],
      ["Marc Lipsitch", "Harvard / infectious disease epidemiology", "https://www.hsph.harvard.edu/profile/marc-lipsitch/"],
      ["Jennifer Gardy", "Bill & Melinda Gates Foundation / genomic epidemiology", "https://www.gatesfoundation.org/about/committed-grants/2020/01/opp1208028"],
    ],
    papers: [
      ["Genomic epidemiology of novel coronavirus: a global subsampling analysis", "2020", "Hadfield, Megill, Bell et al.", "https://doi.org/10.1038/s41586-020-2008-3"],
      ["Wastewater surveillance for infectious disease: a systematic review", "2020", "Hart and Halden", "https://doi.org/10.1016/j.scitotenv.2020.139076"],
      ["Global genomic surveillance strategy for pathogens with pandemic and epidemic potential", "2022", "World Health Organization", "https://www.who.int/publications/i/item/9789240046979"],
    ],
  },
  "antimicrobial-resistance": {
    scientists: [
      ["Ramanan Laxminarayan", "One Health Trust / AMR economics", "https://onehealthtrust.org/who-we-are/our-team/ramanan-laxminarayan/"],
      ["Gerry Wright", "McMaster University / antibiotic discovery", "https://wlab.mcmaster.ca/"],
      ["Kim Lewis", "Northeastern University / antimicrobial discovery", "https://web.northeastern.edu/kimlewis/"],
      ["Cesar de la Fuente", "University of Pennsylvania / machine biology", "https://delafuentelab.seas.upenn.edu/"],
    ],
    papers: [
      ["Global burden of bacterial antimicrobial resistance in 2019: a systematic analysis", "2022", "Antimicrobial Resistance Collaborators", "https://doi.org/10.1016/S0140-6736(21)02724-0"],
      ["A Deep Learning Approach to Antibiotic Discovery", "2020", "Stokes, Yang, Swanson et al.", "https://doi.org/10.1016/j.cell.2020.01.021"],
      ["Discovery of a structural class of antibiotics with explainable deep learning", "2024", "Wong, Zheng, Valeri et al.", "https://doi.org/10.1038/s41586-023-06887-8"],
    ],
  },
  "autonomous-climate-materials": {
    scientists: [
      ["Alán Aspuru-Guzik", "University of Toronto / self-driving labs", "https://www.matter.toronto.edu/basic-content-page/alan-aspuru-guzik"],
      ["Kristin Persson", "Materials Project / Berkeley Lab", "https://perssongroup.lbl.gov/"],
      ["Gerbrand Ceder", "UC Berkeley / materials computation", "https://ceder.berkeley.edu/"],
      ["Andrew Cooper", "University of Liverpool / mobile robotic chemist", "https://www.liverpool.ac.uk/chemistry/staff/andrew-cooper/"],
    ],
    papers: [
      ["The Materials Project: A materials genome approach to accelerating materials innovation", "2013", "Jain, Ong, Hautier et al.", "https://doi.org/10.1063/1.4812323"],
      ["A mobile robotic chemist", "2020", "Burger, Maffettone, Gusev et al.", "https://doi.org/10.1038/s41586-020-2442-2"],
      ["Accelerated discovery of stable lead-free hybrid organic-inorganic perovskites via machine learning", "2019", "Lu, Liu, et al.", "https://doi.org/10.1038/s41467-018-07961-0"],
    ],
  },
  "clean-power-ai-grid": {
    scientists: [
      ["Jesse Jenkins", "Princeton ZERO Lab / energy systems", "https://mae.princeton.edu/people/faculty/jenkins"],
      ["Sally Benson", "Stanford / energy and climate systems", "https://profiles.stanford.edu/sally-benson"],
      ["Yet-Ming Chiang", "MIT / batteries and materials", "https://dmse.mit.edu/faculty/yet-ming-chiang/"],
      ["Varun Sivaram", "Energy policy and innovation", "https://www.varunsivaram.com/"],
    ],
    papers: [
      ["Electricity 2026", "2026", "International Energy Agency", "https://www.iea.org/reports/electricity-2026"],
      ["Grids are emerging as a bottleneck for connecting supply, demand and storage", "2026", "International Energy Agency", "https://www.iea.org/reports/electricity-2026/grids"],
      ["Net-Zero America: Potential Pathways, Infrastructure, and Impacts", "2021", "Princeton ZERO Lab", "https://netzeroamerica.princeton.edu/"],
    ],
  },
  "resilient-food-systems": {
    scientists: [
      ["Johan Rockstrom", "Potsdam Institute / planetary boundaries", "https://www.pik-potsdam.de/en/institute/departments/earth-system-analysis/research/rd2-crossing-planetary-boundaries/team/johan-rockstrom"],
      ["Rattan Lal", "Ohio State / soil carbon", "https://senr.osu.edu/our-people/rattan-lal"],
      ["Gebisa Ejeta", "Purdue / crop resilience", "https://ag.purdue.edu/directory/gbejeta"],
      ["Molly Jahn", "University of Wisconsin-Madison / food systems", "https://ghi.wisc.edu/staff/jahn-molly/"],
    ],
    papers: [
      ["Food in the Anthropocene: the EAT-Lancet Commission", "2019", "Willett, Rockstrom, Loken et al.", "https://doi.org/10.1016/S0140-6736(18)31788-4"],
      ["Climate Change 2022: Impacts, Adaptation and Vulnerability", "2022", "IPCC Working Group II", "https://www.ipcc.ch/report/ar6/wg2/"],
      ["Climate-smart agriculture sourcebook", "2013", "FAO", "https://www.fao.org/climate-smart-agriculture-sourcebook/en/"],
    ],
  },
  "robotic-science-work": {
    scientists: [
      ["Ross D. King", "Robot scientist research", "https://researchers.anu.edu.au/researchers/king-rd"],
      ["Hod Lipson", "Columbia University / creative machines", "https://www.hodlipson.com/"],
      ["Chelsea Finn", "Stanford / robotics and learning", "https://ai.stanford.edu/~cbfinn/"],
      ["Sergey Levine", "UC Berkeley / robot learning", "https://people.eecs.berkeley.edu/~svlevine/"],
    ],
    papers: [
      ["The automation of science", "2009", "King, Rowland, Oliver et al.", "https://doi.org/10.1126/science.1165620"],
      ["A mobile robotic chemist", "2020", "Burger, Maffettone, Gusev et al.", "https://doi.org/10.1038/s41586-020-2442-2"],
      ["RT-2: Vision-Language-Action Models Transfer Web Knowledge to Robotic Control", "2023", "Brohan, Brown, Carbajal et al.", "https://arxiv.org/abs/2307.15818"],
    ],
  },
  "science-to-company": {
    scientists: [
      ["Robert Langer", "MIT / translational science and company formation", "https://langerlab.mit.edu/"],
      ["Noubar Afeyan", "Flagship Pioneering / venture creation", "https://www.flagshippioneering.com/people/noubar-afeyan"],
      ["Steve Blank", "NSF I-Corps / customer discovery", "https://steveblank.com/"],
      ["Fiona Murray", "MIT Sloan / innovation ecosystems", "https://mitsloan.mit.edu/faculty/directory/fiona-murray"],
    ],
    papers: [
      ["NSF I-Corps", "2026", "National Science Foundation", "https://new.nsf.gov/funding/initiatives/i-corps"],
      ["NIH SEED: Small business funding and support", "2026", "National Institutes of Health", "https://seed.nih.gov/"],
      ["ARPA-H", "2026", "Advanced Research Projects Agency for Health", "https://arpa-h.gov/"],
    ],
  },
};

const detailPages = [
  ...problemDetails.map(problemDetail),
  ...seoBriefs.map(briefPage),
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

function problemDetail(problem) {
  return {
    path: `problems/${problem.slug}/index.html`,
    active: "Problems",
    title: problem.metaTitle,
    description: problem.metaDescription,
    kicker: "Research Problem",
    h1: problem.h1,
    lead: problem.lead,
    stats: [
      ["Domain", problem.domain],
      ["Score", problem.score],
      ["Next proof", problem.nextProof],
    ],
    problem,
    detail: true,
  };
}

function briefPage(brief) {
  return {
    path: `briefs/${brief.slug}/index.html`,
    active: brief.active,
    title: brief.title,
    description: brief.description,
    kicker: brief.kicker,
    h1: brief.h1,
    lead: brief.lead,
    stats: brief.stats,
    brief,
    detail: true,
  };
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

function listHtml(items = [], className = "check-list") {
  return `<ul class="${className}">${items.map((item) => `<li>${item}</li>`).join("")}</ul>`;
}

function keywordCloudHtml(keywords = []) {
  return `<div class="keyword-cloud">${keywords.map((keyword) => `<span>${keyword}</span>`).join("")}</div>`;
}

function sourceLinksHtml(sourceLinks = []) {
  return `<div class="source-list">${sourceLinks
    .map(
      ([label, url]) => `<a href="${url}" target="_blank" rel="noopener noreferrer">
        <span>${label}</span>
        <small>${url.replace(/^https?:\/\//, "")}</small>
      </a>`,
    )
    .join("")}</div>`;
}

function faqHtml(faqs = []) {
  return `<div class="faq-list">${faqs
    .map(
      ([question, answer]) => `<details>
        <summary>${question}</summary>
        <p>${answer}</p>
      </details>`,
    )
    .join("")}</div>`;
}

function scientistSeedHtml(scientists = []) {
  return `<div class="seed-grid">${scientists
    .map(
      ([name, affiliation, url]) => `<a class="seed-card" href="${url}" target="_blank" rel="noopener noreferrer">
        <span>Scientist / lab</span>
        <strong>${name}</strong>
        <p>${affiliation}</p>
      </a>`,
    )
    .join("")}</div>`;
}

function paperSeedHtml(papers = []) {
  return `<div class="seed-list">${papers
    .map(
      ([title, year, authors, url]) => `<a class="paper-row" href="${url}" target="_blank" rel="noopener noreferrer">
        <span>${year} · ${authors}</span>
        <strong>${title}</strong>
        <p>${url.replace(/^https?:\/\//, "")}</p>
      </a>`,
    )
    .join("")}</div>`;
}

function briefLinksHtml(briefs = []) {
  if (!briefs.length) {
    return "";
  }
  return `<div class="brief-link-grid">${briefs
    .map(
      (brief) => `<a class="brief-link-card" href="/briefs/${brief.slug}/">
        <span>AISci SEO brief</span>
        <strong>${brief.h1}</strong>
        <p>${brief.description}</p>
      </a>`,
    )
    .join("")}</div>`;
}

function briefSourceLinksHtml(sourceLinks = []) {
  return `<div class="source-list">${sourceLinks
    .map(([label, url]) => {
      const external = /^https?:\/\//.test(url);
      return `<a href="${url}"${external ? ' target="_blank" rel="noopener noreferrer"' : ""}>
        <span>${label}</span>
        <small>${external ? url.replace(/^https?:\/\//, "") : url}</small>
      </a>`;
    })
    .join("")}</div>`;
}

function problemSectionsHtml(problem) {
  const seed = problemSeeds[problem.slug] || { scientists: [], papers: [] };
  const relatedBriefs = briefsForProblem(problem.slug);
  return `<section class="content-band seo-intent">
      <h2>Search intent this page answers</h2>
      <p>${problem.searchIntent}</p>
      ${keywordCloudHtml(problem.keywords)}
    </section>
    ${
      relatedBriefs.length
        ? `<section class="content-band brief-band">
            <h2>Related AISci briefs</h2>
            <p class="section-note">Shorter search-focused pages that pull new readers into this research problem and its proof-of-work tasks.</p>
            ${briefLinksHtml(relatedBriefs)}
          </section>`
        : ""
    }
    <section class="problem-seo-grid">
      <article class="seo-panel">
        <h2>Why this problem matters now</h2>
        ${listHtml(problem.whyNow)}
      </article>
      <article class="seo-panel">
        <h2>Current progress</h2>
        ${listHtml(problem.progress)}
      </article>
      <article class="seo-panel">
        <h2>Core bottlenecks</h2>
        ${listHtml(problem.bottlenecks)}
      </article>
      <article class="seo-panel">
        <h2>Scientists and institutions to map</h2>
        ${listHtml(problem.people)}
      </article>
    </section>
    <section class="content-band">
      <h2>Scientists working on this problem</h2>
      <p class="section-note">This is the first seed map for AISci. Atlas and founder/admin review should keep expanding it with source-linked scientist profiles and claimable pages.</p>
      ${scientistSeedHtml(seed.scientists)}
    </section>
    <section class="content-band">
      <h2>Papers and reports to start from</h2>
      <p class="section-note">These are seed references. The database graph below is where approved latest papers from Atlas ingestion should appear.</p>
      ${paperSeedHtml(seed.papers)}
    </section>
    <section class="content-band">
      <h2>Proof-of-work tasks for young researchers</h2>
      ${listHtml(problem.proofTasks)}
    </section>
    <section class="content-band">
      <h2>Commercialization paths to watch</h2>
      ${listHtml(problem.commercialization)}
    </section>
    <section class="content-band source-band">
      <h2>Primary sources and reference trails</h2>
      <p>Atlas should keep expanding this source list with papers, datasets, code, patents, conference signals, labs, and startup activity before any claim is promoted to the public graph.</p>
      ${sourceLinksHtml(problem.sourceLinks)}
    </section>
    <section class="content-band">
      <h2>Frequently asked questions</h2>
      ${faqHtml(problem.faqs)}
    </section>
    <section class="content-band" id="databaseDetail" aria-live="polite">
      <div class="portal-empty compact">
        <h2>Loading database graph</h2>
        <p>Fetching approved progress, papers, scientists, and follow controls from Supabase.</p>
      </div>
    </section>
    <section class="content-band discussion-band" id="problemDiscussion" aria-live="polite">
      <div class="portal-empty compact">
        <h2>Loading discussion</h2>
        <p>Fetching approved discussion threads and the contribution form.</p>
      </div>
    </section>`;
}

function briefSectionsHtml(brief) {
  const parentProblem = problemDetails.find((problem) => problem.slug === brief.problemSlug);
  return `<article class="brief-layout">
      <aside class="brief-toc">
        <strong>Brief map</strong>
        <a href="#search-problem">Search problem</a>
        <a href="#evidence-system">Evidence system</a>
        <a href="#people">People to map</a>
        <a href="#proof-work">Proof-of-work</a>
        <a href="#capital">Capital relevance</a>
        ${parentProblem ? `<a href="/problems/${parentProblem.slug}/">Parent problem</a>` : ""}
      </aside>
      <div class="brief-body">
        <section class="content-band seo-intent" id="search-problem">
          <h2>${brief.sections[0].title}</h2>
          <p>${brief.sections[0].body}</p>
          ${keywordCloudHtml(brief.keywords)}
        </section>
        <section class="content-band" id="evidence-system">
          <h2>${brief.sections[1].title}</h2>
          ${listHtml(brief.sections[1].items)}
        </section>
        <section class="content-band" id="people">
          <h2>${brief.sections[2].title}</h2>
          ${listHtml(brief.sections[2].items)}
        </section>
        <section class="content-band brief-callout" id="proof-work">
          <h2>${brief.sections[3].title}</h2>
          <p>${brief.sections[3].body}</p>
          <a class="primary-btn" href="/intake/?type=proof">Submit proof-of-work</a>
        </section>
        <section class="content-band" id="capital">
          <h2>${brief.sections[4].title}</h2>
          <p>${brief.sections[4].body}</p>
        </section>
        <section class="content-band source-band">
          <h2>Sources and next reading</h2>
          ${briefSourceLinksHtml(brief.sourceLinks)}
        </section>
      </div>
    </article>`;
}

function sectionsHtml(page) {
  if (page.problem) {
    return problemSectionsHtml(page.problem);
  }

  if (page.brief) {
    return briefSectionsHtml(page.brief);
  }

  if (page.detail) {
    const dynamicProblemDetail =
      page.active === "Problems"
        ? `<section class="content-band" id="databaseDetail" aria-live="polite">
            <div class="portal-empty compact">
              <h2>Loading database graph</h2>
              <p>Fetching approved progress, papers, scientists, and follow controls from Supabase.</p>
            </div>
          </section>`
        : "";
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
    </section>${dynamicProblemDetail}`;
  }

  const dynamicProblemLibrary =
    page.path === "problems/index.html"
      ? `<section class="content-band">
          <h2>Live problem graph</h2>
          <div class="entity-grid" id="problemDatabase" aria-live="polite">
            <div class="portal-empty compact">
              <h2>Loading database problems</h2>
              <p>Fetching approved Supabase records and Atlas counts.</p>
            </div>
          </div>
        </section>`
      : "";

  return `${page.cards?.length ? `<section class="entity-grid">${cardsHtml(page.cards)}</section>` : ""}
    ${dynamicProblemLibrary}
    ${(page.sections || [])
      .map(
        (section) => `<section class="content-band">
          <h2>${section.title}</h2>
          <ul class="check-list">${section.items.map((item) => `<li>${item}</li>`).join("")}</ul>
        </section>`,
      )
      .join("")}`;
}

function structuredData(page, canonical) {
  const website = { "@type": "WebSite", name: "AISci.fans", url: siteUrl };

  if (page.brief) {
    const brief = page.brief;
    return {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: page.h1,
      name: page.title,
      description: page.description,
      url: canonical,
      dateModified: lastmod,
      keywords: brief.keywords.join(", "),
      about: brief.keywords.map((name) => ({ "@type": "Thing", name })),
      citation: brief.sourceLinks.map(([, url]) => (url.startsWith("/") ? `${siteUrl}${url}` : url)),
      isPartOf: website,
    };
  }

  if (!page.problem) {
    return {
      "@context": "https://schema.org",
      "@type": page.detail ? "Article" : "CollectionPage",
      headline: page.h1,
      name: page.title,
      description: page.description,
      url: canonical,
      isPartOf: website,
    };
  }

  const problem = page.problem;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: page.h1,
        name: page.title,
        description: page.description,
        url: canonical,
        dateModified: lastmod,
        keywords: problem.keywords.join(", "),
        about: problem.keywords.map((name) => ({ "@type": "Thing", name })),
        citation: [
          ...problem.sourceLinks.map(([, url]) => url),
          ...(problemSeeds[problem.slug]?.papers || []).map(([, , , url]) => url),
        ],
        isPartOf: website,
      },
      {
        "@type": "FAQPage",
        mainEntity: problem.faqs.map(([name, text]) => ({
          "@type": "Question",
          name,
          acceptedAnswer: { "@type": "Answer", text },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
          { "@type": "ListItem", position: 2, name: "Problems", item: `${siteUrl}/problems/` },
          { "@type": "ListItem", position: 3, name: problem.title, item: canonical },
        ],
      },
    ],
  };
}

function html(page) {
  const canonical = `${siteUrl}/${page.path.replace(/index\.html$/, "")}`;
  const problemSlug =
    page.active === "Problems" && page.detail ? page.path.split("/").slice(-2, -1)[0] : "";
  const bodyAttrs =
    page.path === "problems/index.html"
      ? ' data-page="problems"'
      : problemSlug
        ? ` data-page="problem-detail" data-problem-slug="${problemSlug}"`
        : "";
  const ld = structuredData(page, canonical);
  const keywordMeta = page.problem
    ? `\n    <meta name="keywords" content="${page.problem.keywords.join(", ")}" />`
    : "";
  const briefKeywordMeta = page.brief
    ? `\n    <meta name="keywords" content="${page.brief.keywords.join(", ")}" />`
    : "";

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self' https://*.supabase.co; object-src 'none'; base-uri 'none'; form-action 'self'; upgrade-insecure-requests" />
    <meta name="referrer" content="no-referrer" />
    <meta name="description" content="${page.description}" />${keywordMeta}${briefKeywordMeta}
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
  <body${bodyAttrs}>
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
            <a class="secondary-btn" href="/login/">Sign in</a>
            <a class="primary-btn" href="/intake/?type=talent">Create Passport</a>
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
    ${
      page.active === "Problems"
        ? '<script src="/vendor/supabase.js"></script>\n    <script src="/research.js?v=20260525"></script>'
        : ""
    }
  </body>
</html>`;
}

async function writePage(page) {
  const target = join(root, page.path);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, html(page).replace(/[ \t]+$/gm, ""));
}

function sitemap() {
  const urls = ["index.html", ...extraPaths, ...pages.map((page) => page.path), ...detailPages.map((page) => page.path)]
    .map((path) => `${siteUrl}/${path.replace(/index\.html$/, "")}`);
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${url}</loc>
    <lastmod>${lastmod}</lastmod>
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
