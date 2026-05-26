const scientistState = {
  supabaseClientPromise: null,
  scientist: null,
};

const scientist$ = (selector, parent = document) => parent.querySelector(selector);

function scientistEscape(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function scientistSupabase() {
  if (!scientistState.supabaseClientPromise) {
    scientistState.supabaseClientPromise = (async () => {
      if (!window.supabase?.createClient) {
        return null;
      }
      const response = await fetch("/api/config", { credentials: "same-origin" });
      if (!response.ok) {
        return null;
      }
      const payload = await response.json();
      return window.supabase.createClient(
        payload.supabase.supabaseUrl,
        payload.supabase.supabaseAnonKey,
        {
          auth: {
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: true,
            flowType: "pkce",
          },
        },
      );
    })();
  }
  return scientistState.supabaseClientPromise;
}

async function scientistAuthHeaders() {
  const client = await scientistSupabase();
  if (!client) {
    return {};
  }
  const { data } = await client.auth.getSession();
  return data.session?.access_token ? { Authorization: `Bearer ${data.session.access_token}` } : {};
}

async function scientistApi(path, options = {}) {
  const response = await fetch(path, {
    credentials: "same-origin",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(await scientistAuthHeaders()),
      ...(options.headers || {}),
    },
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.message || payload.error || "Request failed");
  }
  return payload;
}

function currentSlug() {
  const params = new URLSearchParams(window.location.search);
  return params.get("slug") || window.location.pathname.split("/").filter(Boolean).pop() || "";
}

function paperRows(papers) {
  if (!papers.length) {
    return `<div class="portal-empty compact"><h2>No approved papers yet</h2><p>Atlas imports candidate papers for founder/admin review before public display.</p></div>`;
  }
  return papers
    .map(
      (paper) => `<a class="paper-row" href="${scientistEscape(paper.source_url)}" rel="noopener noreferrer">
        <span>${scientistEscape([paper.source, paper.year, paper.venue].filter(Boolean).join(" · "))}</span>
        <strong>${scientistEscape(paper.title)}</strong>
        <p>${scientistEscape((paper.authors || []).map((author) => author.name).filter(Boolean).slice(0, 6).join(", "))}</p>
      </a>`,
    )
    .join("");
}

function problemRows(problems) {
  if (!problems.length) {
    return `<div class="portal-empty compact"><h2>No approved problem links yet</h2><p>This profile can still be claimed while Atlas builds source-linked relationships.</p></div>`;
  }
  return problems
    .map(
      (problem) => `<a class="submission-item" href="/problems/${scientistEscape(problem.slug)}/">
        <span>${scientistEscape(problem.domain || problem.relationship || "Problem")}</span>
        <h3>${scientistEscape(problem.title)}</h3>
        <p>${scientistEscape(problem.summary || "")}</p>
      </a>`,
    )
    .join("");
}

async function loadScientist() {
  const target = scientist$("#scientistProfile");
  const slug = currentSlug();
  if (!target || !slug || slug === "scientists") {
    target.innerHTML = `<div class="portal-empty"><h2>Scientist profile</h2><p>Open a scientist URL from a problem page, or use Atlas after ingestion has approved researcher nodes.</p></div>`;
    return;
  }

  try {
    const payload = await scientistApi(`/api/scientists?slug=${encodeURIComponent(slug)}`);
    scientistState.scientist = payload.scientist;
    const scientist = payload.scientist;
    document.title = `${scientist.full_name} | AISci.fans`;
    target.innerHTML = `
      <section class="page-hero scientist-hero">
        <div class="eyebrow"><span>Scientist Profile</span><span>${scientistEscape(scientist.claim_status || "unclaimed")}</span></div>
        <h1>${scientistEscape(scientist.full_name)}</h1>
        <p>${scientistEscape(scientist.affiliation || "Affiliation pending source verification")}</p>
        <div class="page-stats">
          <div><strong>${scientistEscape(Math.round((scientist.confidence || 0) * 100))}</strong><span>confidence</span></div>
          <div><strong>${payload.problems.length}</strong><span>problem links</span></div>
          <div><strong>${payload.papers.length}</strong><span>papers</span></div>
        </div>
      </section>
      <section class="detail-layout">
        <article class="detail-main">
          <h2>Related problems</h2>
          <div class="submission-list">${problemRows(payload.problems || [])}</div>
          <h2>Related papers</h2>
          <div class="paper-list">${paperRows(payload.papers || [])}</div>
        </article>
        <aside class="detail-side">
          <div class="detail-box">
            <strong>Claim status</strong>
            <p>${scientist.claimed_by ? "This profile has a verified claimant." : "This profile can be claimed with evidence."}</p>
          </div>
          <div class="detail-box">
            <strong>Evidence</strong>
            <p>${scientistEscape([scientist.orcid, scientist.website, scientist.source_url].filter(Boolean).join(" · ") || "Pending source trail")}</p>
          </div>
        </aside>
      </section>
    `;
    scientist$("#claimTargetName").value = scientist.full_name;
    scientist$("#claimScientistSlug").value = scientist.slug;
  } catch (error) {
    target.innerHTML = `<div class="portal-message" data-tone="error">${scientistEscape(error.message)}</div>`;
  }
}

function initClaimForm() {
  scientist$("#claimForm")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form).entries());
    const message = scientist$("#claimMessage");
    message.hidden = true;
    try {
      await scientistApi("/api/claims", {
        method: "POST",
        body: JSON.stringify({
          scientistSlug: values.scientistSlug,
          targetScientistName: values.targetScientistName,
          evidenceType: values.evidenceType,
          evidenceUrl: values.evidenceUrl,
          evidenceText: values.evidenceText,
          noConfidentialData: values.noConfidentialData === "on",
        }),
      });
      message.textContent = "Claim submitted. Founder/admin review is required before verification.";
      message.dataset.tone = "success";
      message.hidden = false;
      window.va?.("event", {
        name: "profile_claim_created",
        data: { scientist: scientistState.scientist?.slug || values.scientistSlug || "manual" },
      });
      form.reset();
      if (scientistState.scientist) {
        scientist$("#claimTargetName").value = scientistState.scientist.full_name;
        scientist$("#claimScientistSlug").value = scientistState.scientist.slug;
      }
    } catch (error) {
      if (error.message.includes("Sign in")) {
        window.location.href = "/login/";
        return;
      }
      message.textContent = error.message;
      message.dataset.tone = "error";
      message.hidden = false;
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  loadScientist();
  initClaimForm();
});
