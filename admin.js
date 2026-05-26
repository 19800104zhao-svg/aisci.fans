const adminState = {
  supabaseClientPromise: null,
  queue: null,
};

const admin$ = (selector, parent = document) => parent.querySelector(selector);
const admin$$ = (selector, parent = document) => Array.from(parent.querySelectorAll(selector));

function adminEscape(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function adminSupabase() {
  if (!adminState.supabaseClientPromise) {
    adminState.supabaseClientPromise = (async () => {
      if (!window.supabase?.createClient) {
        throw new Error("Supabase browser client is missing.");
      }
      const response = await fetch("/api/config", { credentials: "same-origin" });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload.message || payload.error || "Supabase is not configured yet");
      }
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
  return adminState.supabaseClientPromise;
}

async function adminHeaders() {
  const client = await adminSupabase();
  const { data } = await client.auth.getSession();
  return data.session?.access_token ? { Authorization: `Bearer ${data.session.access_token}` } : {};
}

async function adminApi(path, options = {}) {
  const response = await fetch(path, {
    credentials: "same-origin",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(await adminHeaders()),
      ...(options.headers || {}),
    },
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.message || payload.error || "Request failed");
  }
  return payload;
}

function statusPill(status) {
  return `<span class="admin-pill">${adminEscape(status || "unknown")}</span>`;
}

function reviewButtons(entityType, entityId) {
  return `
    <div class="admin-actions">
      <button class="secondary-btn review-btn" type="button" data-entity-type="${adminEscape(entityType)}" data-entity-id="${adminEscape(entityId)}" data-decision="reject">Reject</button>
      <button class="secondary-btn review-btn" type="button" data-entity-type="${adminEscape(entityType)}" data-entity-id="${adminEscape(entityId)}" data-decision="mark_private">Private</button>
      <button class="secondary-btn review-btn" type="button" data-entity-type="${adminEscape(entityType)}" data-entity-id="${adminEscape(entityId)}" data-decision="mark_public">Public</button>
      <button class="primary-btn review-btn" type="button" data-entity-type="${adminEscape(entityType)}" data-entity-id="${adminEscape(entityId)}" data-decision="approve">Approve</button>
    </div>
  `;
}

function submissionCard(item) {
  return `
    <article class="admin-item">
      <div>
        ${statusPill(item.status)}
        <h3>${adminEscape(item.title)}</h3>
        <p>${adminEscape(item.profiles?.email || "unknown user")} · ${adminEscape(item.type)} · ${adminEscape(item.visibility)}</p>
        <pre>${adminEscape(JSON.stringify(item.payload, null, 2))}</pre>
      </div>
      ${reviewButtons("submission", item.id)}
    </article>
  `;
}

function discussionCard(item) {
  return `
    <article class="admin-item">
      <div>
        ${statusPill(item.status)}
        <h3>${adminEscape(item.title)}</h3>
        <p>${adminEscape(item.profiles?.email || "unknown user")} · ${adminEscape(item.research_problems?.title || "unknown problem")} · ${adminEscape(item.visibility)}</p>
        ${item.source_url ? `<a class="text-link" href="${adminEscape(item.source_url)}" rel="noopener noreferrer">Source URL</a>` : ""}
        <pre>${adminEscape(item.body)}</pre>
      </div>
      ${reviewButtons("discussion", item.id)}
    </article>
  `;
}

function claimCard(item) {
  return `
    <article class="admin-item">
      <div>
        ${statusPill(item.status)}
        <h3>${adminEscape(item.target_scientist_name)}</h3>
        <p>${adminEscape(item.profiles?.email || "unknown user")} · ${adminEscape(item.evidence_type)}</p>
        <p>${item.evidence_url ? `<a class="text-link" href="${adminEscape(item.evidence_url)}" rel="noopener noreferrer">Evidence URL</a>` : ""}</p>
        <pre>${adminEscape(JSON.stringify(item.evidence_payload, null, 2))}</pre>
      </div>
      ${reviewButtons("claim_request", item.id)}
    </article>
  `;
}

function candidateCard(entityType, item) {
  const title = item.title || item.full_name || item.slug || item.id;
  const source = item.source_url || item.website || item.openalex_id || item.semantic_scholar_id || "";
  return `
    <article class="admin-item">
      <div>
        ${statusPill(item.status)}
        <h3>${adminEscape(title)}</h3>
        <p>${adminEscape(item.source || item.domain || item.affiliation || "candidate")} · confidence ${adminEscape(item.confidence)}</p>
        ${source ? `<a class="text-link" href="${adminEscape(source)}" rel="noopener noreferrer">Source</a>` : ""}
      </div>
      ${reviewButtons(entityType, item.id)}
    </article>
  `;
}

function runCard(run) {
  return `
    <article class="admin-item compact">
      <div>
        ${statusPill(run.status)}
        <h3>${adminEscape(new Date(run.created_at).toLocaleString())}</h3>
        <p>Records seen: ${adminEscape(run.records_seen)} ${run.error_message ? `· ${adminEscape(run.error_message)}` : ""}</p>
      </div>
    </article>
  `;
}

function renderAdminQueue(queue) {
  const discussions = queue.discussions || [];
  admin$("#adminSummary").innerHTML = `
    <div><strong>${queue.profiles.length}</strong><span>users</span></div>
    <div><strong>${queue.submissions.length}</strong><span>submissions</span></div>
    <div><strong>${discussions.length}</strong><span>discussions</span></div>
    <div><strong>${queue.claimRequests.length}</strong><span>claims</span></div>
    <div><strong>${queue.pendingPapers.length + queue.pendingScientists.length + queue.pendingProblems.length}</strong><span>candidates</span></div>
  `;
  admin$("#submissionQueue").innerHTML = queue.submissions.length
    ? queue.submissions.map(submissionCard).join("")
    : `<div class="portal-empty compact"><h2>No submissions</h2><p>User submissions will appear here.</p></div>`;
  admin$("#discussionQueue").innerHTML = discussions.length
    ? discussions.map(discussionCard).join("")
    : `<div class="portal-empty compact"><h2>No discussions</h2><p>Problem discussion posts will appear here.</p></div>`;
  admin$("#claimQueue").innerHTML = queue.claimRequests.length
    ? queue.claimRequests.map(claimCard).join("")
    : `<div class="portal-empty compact"><h2>No claims</h2><p>Scientist profile claims will appear here.</p></div>`;
  admin$("#candidateQueue").innerHTML = [
    ...queue.pendingProblems.map((item) => candidateCard("research_problem", item)),
    ...queue.pendingPapers.map((item) => candidateCard("paper", item)),
    ...queue.pendingScientists.map((item) => candidateCard("scientist", item)),
  ].join("") || `<div class="portal-empty compact"><h2>No pending candidates</h2><p>Atlas ingestion candidates will appear here.</p></div>`;
  admin$("#ingestionQueue").innerHTML = queue.ingestionRuns.length
    ? queue.ingestionRuns.map(runCard).join("")
    : `<div class="portal-empty compact"><h2>No ingestion runs</h2><p>Vercel Cron will populate this after Supabase and CRON_SECRET are configured.</p></div>`;

  admin$$(".review-btn").forEach((button) => {
    button.addEventListener("click", () => reviewEntity(button));
  });
}

async function loadAdminQueue() {
  const message = admin$("#adminMessage");
  try {
    const queue = await adminApi("/api/admin/queue");
    adminState.queue = queue;
    message.hidden = true;
    renderAdminQueue(queue);
  } catch (error) {
    if (error.message.includes("Sign in")) {
      window.location.href = "/login/";
      return;
    }
    message.textContent = error.message;
    message.dataset.tone = "error";
    message.hidden = false;
  }
}

async function reviewEntity(button) {
  const note = admin$("#reviewNote").value;
  const message = admin$("#adminMessage");
  button.disabled = true;
  try {
    await adminApi("/api/admin/review", {
      method: "POST",
      body: JSON.stringify({
        entityType: button.dataset.entityType,
        entityId: button.dataset.entityId,
        decision: button.dataset.decision,
        note,
      }),
    });
    message.textContent = "Review saved.";
    message.dataset.tone = "success";
    message.hidden = false;
    window.va?.("event", {
      name: "admin_review",
      data: {
        entityType: button.dataset.entityType,
        decision: button.dataset.decision,
      },
    });
    await loadAdminQueue();
  } catch (error) {
    message.textContent = error.message;
    message.dataset.tone = "error";
    message.hidden = false;
  } finally {
    button.disabled = false;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  admin$("#refreshAdmin")?.addEventListener("click", loadAdminQueue);
  loadAdminQueue();
});
