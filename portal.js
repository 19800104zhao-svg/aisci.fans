const ROLE_LABELS = {
  talent: "Talent",
  lab: "Lab",
  capital: "Capital",
  scientist: "Scientist",
  admin: "Admin",
};

const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => Array.from(parent.querySelectorAll(selector));

let supabaseClientPromise;
let cachedProblems = [];

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function showMessage(message, tone = "info") {
  const target = $("#portalMessage");
  if (!target) {
    return;
  }
  target.textContent = message;
  target.dataset.tone = tone;
  target.hidden = false;
}

function clearMessage() {
  const target = $("#portalMessage");
  if (target) {
    target.hidden = true;
    target.textContent = "";
  }
}

function formValues(form) {
  return Object.fromEntries(new FormData(form).entries());
}

function lines(value) {
  return String(value || "")
    .split(/\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

async function getSupabaseClient() {
  if (!supabaseClientPromise) {
    supabaseClientPromise = (async () => {
      if (!window.supabase?.createClient) {
        throw new Error("Supabase browser client is missing. Run npm install and npm run vendor:supabase.");
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
  return supabaseClientPromise;
}

async function getSession() {
  const client = await getSupabaseClient();
  const { data, error } = await client.auth.getSession();
  if (error) {
    throw error;
  }
  return data.session || null;
}

async function authHeaders() {
  const session = await getSession();
  return session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {};
}

async function api(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(await authHeaders()),
    ...(options.headers || {}),
  };
  const response = await fetch(path, {
    credentials: "same-origin",
    ...options,
    headers,
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = payload.message || payload.error || "Request failed";
    const error = new Error(message);
    error.status = response.status;
    error.payload = payload;
    throw error;
  }
  return payload;
}

function authPrompt() {
  return `
    <div class="portal-empty">
      <span class="kicker">Account required</span>
      <h2>Sign in to continue</h2>
      <p>Your profile, submission, follow, or claim needs to be attached to a real account before AISci can route it.</p>
      <a class="primary-btn" href="/login/">Sign in or register</a>
    </div>
  `;
}

function switchAuthMode(mode) {
  $$(".auth-tab").forEach((button) => {
    button.classList.toggle("active", button.dataset.authMode === mode);
  });
  $$(".auth-form").forEach((form) => {
    form.hidden = form.dataset.authForm !== mode;
  });
  clearMessage();
}

async function initLogin() {
  $$(".auth-tab").forEach((button) => {
    button.addEventListener("click", () => switchAuthMode(button.dataset.authMode));
  });

  try {
    await getSupabaseClient();
  } catch (error) {
    showMessage(error.message, "error");
    return;
  }

  $$(".oauth-btn").forEach((button) => {
    button.addEventListener("click", async () => {
      clearMessage();
      try {
        const client = await getSupabaseClient();
        const { error } = await client.auth.signInWithOAuth({
          provider: button.dataset.provider,
          options: {
            redirectTo: `${window.location.origin}/dashboard/`,
          },
        });
        if (error) {
          throw error;
        }
      } catch (error) {
        showMessage(error.message, "error");
      }
    });
  });

  $("#loginForm")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearMessage();
    try {
      const values = formValues(event.currentTarget);
      const client = await getSupabaseClient();
      const { error } = await client.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });
      if (error) {
        throw error;
      }
      window.location.href = "/dashboard/";
    } catch (error) {
      showMessage(error.message, "error");
    }
  });

  $("#registerForm")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearMessage();
    try {
      const values = formValues(event.currentTarget);
      const client = await getSupabaseClient();
      const { data, error } = await client.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            name: values.name,
            role: values.role,
            organization: values.organization,
            country: values.country,
            headline: values.headline,
          },
          emailRedirectTo: `${window.location.origin}/dashboard/`,
        },
      });
      if (error) {
        throw error;
      }

      if (!data.session) {
        showMessage("Account created. Check your email to confirm sign-in before submitting data.", "success");
        return;
      }

      await api("/api/me", {
        method: "PUT",
        body: JSON.stringify({
          name: values.name,
          role: values.role,
          profileType: values.role,
          organization: values.organization,
          country: values.country,
          headline: values.headline,
        }),
      });
      window.location.href = "/intake/?type=" + encodeURIComponent(values.role || "talent");
    } catch (error) {
      showMessage(error.message, "error");
    }
  });
}

function renderUser(user, profile) {
  const target = $("#dashboardUser");
  if (!target) {
    return;
  }
  target.innerHTML = `
    <div class="portal-avatar">${escapeHtml((user.name || "A").slice(0, 2).toUpperCase())}</div>
    <div>
      <span class="kicker">${escapeHtml(ROLE_LABELS[user.role] || user.role)}</span>
      <h1>${escapeHtml(user.name)}</h1>
      <p>${escapeHtml(user.headline || profile?.focusArea || "AISci member")}</p>
      <div class="portal-meta">
        <span>${escapeHtml(user.email)}</span>
        ${user.organization ? `<span>${escapeHtml(user.organization)}</span>` : ""}
        ${user.country ? `<span>${escapeHtml(user.country)}</span>` : ""}
        ${user.isAdmin ? `<span>Founder admin</span>` : ""}
      </div>
    </div>
  `;
}

function renderSubmissions(submissions) {
  const target = $("#submissionList");
  if (!target) {
    return;
  }

  if (!submissions.length) {
    target.innerHTML = `
      <div class="portal-empty compact">
        <h2>No submissions yet</h2>
        <p>Create a passport, proof-of-work, lab proposal, capital thesis, or interaction request.</p>
      </div>
    `;
    return;
  }

  target.innerHTML = submissions
    .map((submission) => {
      const problem = submission.research_problems?.title;
      return `
        <article class="submission-item">
          <span>${escapeHtml(ROLE_LABELS[submission.type] || submission.type)} · ${escapeHtml(submission.status)} · ${escapeHtml(submission.visibility)}</span>
          <h3>${escapeHtml(submission.title || submission.type)}</h3>
          <p>${problem ? `Problem: ${escapeHtml(problem)} · ` : ""}${escapeHtml(new Date(submission.created_at).toLocaleString())}</p>
        </article>
      `;
    })
    .join("");
}

function renderFollows(follows) {
  const target = $("#followList");
  if (!target) {
    return;
  }
  if (!follows.length) {
    target.innerHTML = `<div class="portal-empty compact"><h2>No followed problems</h2><p>Follow a problem page to build your AISci graph.</p></div>`;
    return;
  }
  target.innerHTML = follows
    .map((follow) => {
      const problem = follow.research_problems || {};
      return `
        <a class="submission-item" href="/problems/${escapeHtml(problem.slug || "")}/">
          <span>${escapeHtml(problem.domain || "Problem")}</span>
          <h3>${escapeHtml(problem.title || "Research problem")}</h3>
          <p>${escapeHtml(problem.summary || "")}</p>
        </a>
      `;
    })
    .join("");
}

function renderClaims(claims) {
  const target = $("#claimList");
  if (!target) {
    return;
  }
  if (!claims.length) {
    target.innerHTML = `<div class="portal-empty compact"><h2>No profile claims</h2><p>Claim a scientist page with ORCID, institutional email, lab page, paper email, or GitHub evidence.</p></div>`;
    return;
  }
  target.innerHTML = claims
    .map((claim) => `
      <article class="submission-item">
        <span>${escapeHtml(claim.evidence_type)} · ${escapeHtml(claim.status)}</span>
        <h3>${escapeHtml(claim.target_scientist_name)}</h3>
        <p>${escapeHtml(claim.admin_note || "Founder/admin review pending.")}</p>
      </article>
    `)
    .join("");
}

async function initDashboard() {
  const gate = $("#dashboardGate");
  try {
    const [{ user, profile }, submissionData, followData, claimData] = await Promise.all([
      api("/api/me"),
      api("/api/submissions"),
      api("/api/follows"),
      api("/api/claims"),
    ]);
    if (gate) {
      gate.hidden = true;
    }
    renderUser(user, profile);
    renderSubmissions(submissionData.submissions || []);
    renderFollows(followData.follows || []);
    renderClaims(claimData.claims || []);
    if (user.isAdmin) {
      $("#adminLink")?.removeAttribute("hidden");
    }
  } catch (error) {
    if (gate) {
      gate.innerHTML = authPrompt();
      gate.hidden = false;
    }
    showMessage(error.message, error.status === 401 ? "info" : "error");
  }

  $("#logoutButton")?.addEventListener("click", async () => {
    try {
      const client = await getSupabaseClient();
      await client.auth.signOut();
      await api("/api/auth/logout", { method: "POST", body: "{}" }).catch(() => null);
    } finally {
      window.location.href = "/";
    }
  });
}

function activeIntakeType() {
  const fromUrl = new URLSearchParams(window.location.search).get("type");
  return ["talent", "lab", "capital", "proof"].includes(fromUrl) ? fromUrl : "talent";
}

function setIntakeType(type) {
  $$(".intake-tab").forEach((button) => {
    button.classList.toggle("active", button.dataset.type === type);
  });
  $$(".intake-panel").forEach((panel) => {
    panel.hidden = panel.dataset.panel !== type;
  });
  const input = $("#submissionType");
  if (input) {
    input.value = type;
  }
  const url = new URL(window.location.href);
  url.searchParams.set("type", type);
  window.history.replaceState({}, "", url);
}

function collectCommon(values) {
  const selected = cachedProblems.find((problem) => problem.slug === values.problemSlug);
  return {
    problemSlug: values.problemSlug,
    problemTitle: selected?.title || "",
    sourceUrl: values.sourceUrl,
    notes: values.notes,
    noConfidentialData: values.noConfidentialData === "on",
  };
}

function collectPayload(type, values) {
  const common = collectCommon(values);
  if (type === "talent") {
    return {
      ...common,
      focusArea: values.talentFocusArea,
      location: values.talentLocation,
      stage: values.talentStage,
      proofLinks: lines(values.talentProofLinks),
      skills: lines(values.talentSkills),
      strongestWork: values.talentStrongestWork,
      mentorAsk: values.talentMentorAsk,
      portfolioUrl: values.talentPortfolioUrl,
    };
  }

  if (type === "lab") {
    return {
      ...common,
      labName: values.labName,
      leadName: values.labLeadName,
      affiliation: values.labAffiliation,
      problemArea: values.labProblemArea,
      agenda: values.labAgenda,
      openRoles: lines(values.labOpenRoles),
      dataOrEquipment: values.labDataOrEquipment,
      commercializationBoundary: values.labCommercializationBoundary,
      website: values.labWebsite,
    };
  }

  if (type === "capital") {
    return {
      ...common,
      investorName: values.capitalInvestorName,
      firm: values.capitalFirm,
      checkSize: values.capitalCheckSize,
      sectors: lines(values.capitalSectors),
      thesis: values.capitalThesis,
      support: values.capitalSupport,
      introPreference: values.capitalIntroPreference,
      website: values.capitalWebsite,
    };
  }

  return {
    ...common,
    title: values.proofTitle,
    evidenceType: values.proofEvidenceType,
    artifactUrl: values.proofArtifactUrl,
    summary: values.proofSummary,
    reproducibilityNotes: values.proofReproducibilityNotes,
  };
}

async function loadProblemOptions() {
  const select = $("#problemSlug");
  if (!select) {
    return;
  }
  try {
    const payload = await fetch("/api/problems").then((response) => response.json());
    cachedProblems = payload.problems || [];
    select.innerHTML = `<option value="">No specific problem yet</option>${cachedProblems
      .map((problem) => `<option value="${escapeHtml(problem.slug)}">${escapeHtml(problem.title)}</option>`)
      .join("")}`;
  } catch {
    select.innerHTML = `<option value="">Problem database unavailable</option>`;
  }
}

async function initIntake() {
  const gate = $("#intakeGate");
  setIntakeType(activeIntakeType());
  await loadProblemOptions();

  try {
    await api("/api/me");
    if (gate) {
      gate.hidden = true;
    }
  } catch (error) {
    if (gate) {
      gate.innerHTML = authPrompt();
      gate.hidden = false;
    }
    $("#intakeForm")?.setAttribute("hidden", "");
    showMessage(error.message, error.status === 401 ? "info" : "error");
    return;
  }

  $$(".intake-tab").forEach((button) => {
    button.addEventListener("click", () => setIntakeType(button.dataset.type));
  });

  $("#intakeForm")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearMessage();
    const values = formValues(event.currentTarget);
    const type = values.type;
    try {
      await api("/api/submissions", {
        method: "POST",
        body: JSON.stringify({
          type,
          visibility: values.visibility || "private",
          payload: collectPayload(type, values),
        }),
      });
      window.va?.("event", { name: "submission_created", data: { type } });
      showMessage("Saved as pending. Founder/admin review is required before anything becomes public.", "success");
      event.currentTarget.reset();
      setIntakeType(type);
      await loadProblemOptions();
    } catch (error) {
      showMessage(error.message, "error");
    }
  });
}

function initPortal() {
  const page = document.body.dataset.page;
  if (page === "login") {
    initLogin();
  }
  if (page === "dashboard") {
    initDashboard();
  }
  if (page === "intake") {
    initIntake();
  }
}

document.addEventListener("DOMContentLoaded", initPortal);
