const researchState = {
  supabaseClientPromise: null,
};

const research$ = (selector, parent = document) => parent.querySelector(selector);

function researchEscape(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function getResearchSupabase() {
  if (!researchState.supabaseClientPromise) {
    researchState.supabaseClientPromise = (async () => {
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
  return researchState.supabaseClientPromise;
}

async function researchAuthHeaders() {
  const client = await getResearchSupabase();
  if (!client) {
    return {};
  }
  const { data } = await client.auth.getSession();
  return data.session?.access_token ? { Authorization: `Bearer ${data.session.access_token}` } : {};
}

async function researchApi(path, options = {}) {
  const response = await fetch(path, {
    credentials: "same-origin",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(await researchAuthHeaders()),
      ...(options.headers || {}),
    },
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.message || payload.error || "Request failed");
  }
  return payload;
}

function problemCard(problem) {
  const counts = problem.counts || {};
  return `
    <a class="entity-card problem-db-card" href="/problems/${researchEscape(problem.slug)}/">
      <span>${researchEscape(problem.domain)} · score ${researchEscape(problem.score)}</span>
      <h2>${researchEscape(problem.title)}</h2>
      <p>${researchEscape(problem.summary)}</p>
      <div class="mini-stats">
        <strong>${counts.progress || 0}<span>progress</span></strong>
        <strong>${counts.papers || 0}<span>papers</span></strong>
        <strong>${counts.scientists || 0}<span>scientists</span></strong>
      </div>
    </a>
  `;
}

async function renderProblemDatabase() {
  const target = research$("#problemDatabase");
  if (!target) {
    return;
  }
  try {
    const payload = await researchApi("/api/problems");
    if (!payload.problems?.length) {
      target.innerHTML = `<div class="portal-empty compact"><h2>No public problems yet</h2><p>Run the Supabase schema seed, then approve Atlas records.</p></div>`;
      return;
    }
    target.innerHTML = payload.problems.map(problemCard).join("");
    window.va?.("event", { name: "problem_database_view" });
  } catch (error) {
    target.innerHTML = `<div class="portal-empty compact">
      <h2>Live database graph is not connected in this view</h2>
      <p>Approved progress records, papers, scientists, and follow controls will appear here after the Supabase-backed Vercel APIs are available.</p>
    </div>`;
  }
}

function renderProgress(progress) {
  if (!progress.length) {
    return `<div class="detail-box"><strong>Current progress</strong><p>No approved progress records yet. Atlas ingestion stores candidates for admin review.</p></div>`;
  }
  return progress
    .map(
      (item) => `<div class="detail-box">
        <strong>${researchEscape(item.title)}</strong>
        <p>${researchEscape(item.body)}</p>
        <a class="text-link" href="${researchEscape(item.source_url)}" rel="noopener noreferrer">Source</a>
      </div>`,
    )
    .join("");
}

function renderPapers(papers) {
  if (!papers.length) {
    return `<div class="detail-box"><strong>Related papers</strong><p>No approved papers yet. Atlas will import candidates from OpenAlex and Semantic Scholar into the admin queue.</p></div>`;
  }
  return papers
    .map(
      (paper) => `<a class="paper-row" href="${researchEscape(paper.source_url)}" rel="noopener noreferrer">
        <span>${researchEscape([paper.source, paper.year, paper.venue].filter(Boolean).join(" · "))}</span>
        <strong>${researchEscape(paper.title)}</strong>
        <p>${researchEscape((paper.authors || []).map((author) => author.name).filter(Boolean).slice(0, 6).join(", "))}</p>
      </a>`,
    )
    .join("");
}

function renderScientists(scientists) {
  if (!scientists.length) {
    return `<div class="detail-box"><strong>Related scientists</strong><p>No approved scientist nodes yet. Candidate author nodes wait for founder/admin review.</p></div>`;
  }
  return scientists
    .map(
      (scientist) => `<a class="scientist-row" href="/scientists/${researchEscape(scientist.slug)}/">
        <span>${researchEscape(scientist.affiliation || scientist.relationship || "Researcher")}</span>
        <strong>${researchEscape(scientist.full_name)}</strong>
        <p>${researchEscape((scientist.expertise || []).join(", ") || "Claimable AISci scientist profile")}</p>
      </a>`,
    )
    .join("");
}

function renderDiscussionCard(discussion) {
  const statusText = discussion.status === "public" ? "Public" : "Pending review";
  const created = discussion.createdAt ? new Date(discussion.createdAt).toLocaleDateString("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }) : "";
  const authorBits = [
    discussion.author?.name || "AISci member",
    discussion.author?.organization,
    created,
  ].filter(Boolean);

  return `<article class="discussion-card" data-status="${researchEscape(discussion.status)}">
    <header>
      <span>${researchEscape(statusText)}</span>
      <small>${researchEscape(authorBits.join(" · "))}</small>
    </header>
    <h3>${researchEscape(discussion.title || "Research note")}</h3>
    <p>${researchEscape(discussion.body)}</p>
    ${
      discussion.sourceUrl
        ? `<a class="text-link" href="${researchEscape(discussion.sourceUrl)}" target="_blank" rel="noopener noreferrer">Source / evidence</a>`
        : ""
    }
  </article>`;
}

function renderDiscussionList(discussions = []) {
  if (!discussions.length) {
    return `<div class="portal-empty compact">
      <h2>No approved discussion yet</h2>
      <p>Start with a question, replication note, paper critique, dataset lead, or proof-of-work update. Public display requires founder/admin review.</p>
    </div>`;
  }
  return discussions.map(renderDiscussionCard).join("");
}

async function submitProblemDiscussion(event, problemSlug) {
  event.preventDefault();
  const form = event.currentTarget;
  const message = research$("#discussionMessage");
  const button = form.querySelector("button[type='submit']");
  const formData = new FormData(form);
  const body = String(formData.get("body") || "").trim();

  if (body.length < 12) {
    message.textContent = "Please add a more specific research question, evidence note, or contribution.";
    message.dataset.tone = "error";
    message.hidden = false;
    return;
  }

  button.disabled = true;
  try {
    const payload = await researchApi("/api/discussions", {
      method: "POST",
      body: JSON.stringify({
        problemSlug,
        title: formData.get("title"),
        body,
        sourceUrl: formData.get("sourceUrl"),
      }),
    });
    form.reset();
    window.va?.("event", { name: "problem_discussion_created", problem: problemSlug });
    await renderProblemDiscussion(payload.message);
  } catch (error) {
    if (error.message.includes("Sign in")) {
      window.location.href = "/login/";
      return;
    }
    message.textContent = error.message;
    message.dataset.tone = "error";
    message.hidden = false;
  } finally {
    button.disabled = false;
  }
}

async function renderProblemDiscussion(successMessage = "") {
  const target = research$("#problemDiscussion");
  const slug = document.body.dataset.problemSlug;
  if (!target || !slug) {
    return;
  }

  try {
    const payload = await researchApi(`/api/discussions?problem=${encodeURIComponent(slug)}`);
    target.innerHTML = `
      <div class="discussion-head">
        <div>
          <span class="kicker">Problem discussion</span>
          <h2>Discuss this research problem</h2>
          <p>Use this thread for source-linked questions, paper notes, replication attempts, datasets, and proof-of-work updates. New posts are private until founder/admin review.</p>
        </div>
        <a class="secondary-btn" href="/login/">Sign in</a>
      </div>
      <div class="portal-message" id="discussionMessage" role="status" hidden></div>
      <div class="discussion-shell">
        <div class="discussion-list">${renderDiscussionList(payload.discussions || [])}</div>
        <form class="portal-form discussion-form" id="discussionForm">
          <h3>Add a discussion note</h3>
          <label>
            <span>Title</span>
            <input name="title" maxlength="180" placeholder="A precise question, critique, or proof update" />
          </label>
          <label>
            <span>Discussion body</span>
            <textarea name="body" rows="7" maxlength="4000" required placeholder="Explain the question, evidence, paper, dataset, replication result, or experiment idea."></textarea>
          </label>
          <label>
            <span>Source URL</span>
            <input name="sourceUrl" type="url" placeholder="https://doi.org/... or https://arxiv.org/..." />
          </label>
          <p class="form-note">Do not submit confidential data, trade secrets, unpublished sensitive results, or third-party material you do not have rights to share.</p>
          <div class="form-actions">
            <button class="primary-btn" type="submit">Submit for review</button>
          </div>
        </form>
      </div>
    `;
    const message = research$("#discussionMessage");
    if (successMessage && message) {
      message.textContent = successMessage;
      message.dataset.tone = "success";
      message.hidden = false;
    }
    research$("#discussionForm")?.addEventListener("submit", (event) => submitProblemDiscussion(event, slug));
  } catch (error) {
    target.innerHTML = `<div class="discussion-head">
      <div>
        <span class="kicker">Problem discussion</span>
        <h2>Discuss this research problem</h2>
        <p>Source-linked questions, paper notes, replication attempts, datasets, and proof-of-work updates will appear here after the discussion API is connected.</p>
      </div>
      <a class="secondary-btn" href="/login/">Sign in</a>
    </div>
    <div class="portal-empty compact">
      <h2>Discussion API is not connected in this view</h2>
      <p>Static pages still expose the problem, scientists, seed papers, and SEO content. Posting discussions requires the Supabase-backed Vercel API.</p>
    </div>`;
  }
}

async function followProblem(problem) {
  try {
    await researchApi("/api/follows", {
      method: "POST",
      body: JSON.stringify({ problemSlug: problem.slug }),
    });
    const button = research$("#followProblem");
    if (button) {
      button.textContent = "Following";
      button.disabled = true;
    }
    window.va?.("event", { name: "problem_follow", data: { problem: problem.slug } });
  } catch (error) {
    if (error.message.includes("Sign in")) {
      window.location.href = "/login/";
      return;
    }
    const target = research$("#databaseDetailMessage");
    if (target) {
      target.textContent = error.message;
      target.hidden = false;
    }
  }
}

async function renderProblemDetail() {
  const target = research$("#databaseDetail");
  const slug = document.body.dataset.problemSlug;
  if (!target || !slug) {
    return;
  }
  try {
    const payload = await researchApi(`/api/problem?id=${encodeURIComponent(slug)}`);
    const { problem, progress, papers, scientists } = payload;
    target.innerHTML = `
      <div class="detail-head dynamic-detail-head">
        <div>
          <span class="kicker">Database graph</span>
          <h2>${researchEscape(problem.title)}</h2>
          <p>${researchEscape(problem.progress_summary || problem.summary)}</p>
        </div>
        <button class="primary-btn" id="followProblem" type="button">Follow problem</button>
      </div>
      <div class="portal-message" id="databaseDetailMessage" role="status" hidden></div>
      <section class="detail-layout">
        <article class="detail-main">
          <h2>Current progress</h2>
          <div class="detail-grid">${renderProgress(progress || [])}</div>
          <h2>Related papers</h2>
          <div class="paper-list">${renderPapers(papers || [])}</div>
        </article>
        <aside class="detail-side">
          <h2>Related scientists</h2>
          <div class="scientist-list">${renderScientists(scientists || [])}</div>
        </aside>
      </section>
    `;
    research$("#followProblem")?.addEventListener("click", () => followProblem(problem));
    window.va?.("event", { name: "problem_detail_view", problem: problem.slug });
  } catch (error) {
    target.innerHTML = `<div class="portal-empty compact">
      <h2>Live database graph is not connected in this view</h2>
      <p>Approved progress records, latest papers, related scientists, and follow controls will appear here after the Supabase-backed Vercel APIs are available.</p>
    </div>`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderProblemDatabase();
  renderProblemDetail();
  renderProblemDiscussion();
});
