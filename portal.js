const ROLE_LABELS = {
  talent: "Talent",
  lab: "Lab",
  capital: "Capital",
};

const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => Array.from(parent.querySelectorAll(selector));

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

async function api(path, options = {}) {
  const response = await fetch(path, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
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
      <p>Your profile, lab proposal, or capital thesis needs to be attached to a real account before AISci can route it.</p>
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

function initLogin() {
  $$(".auth-tab").forEach((button) => {
    button.addEventListener("click", () => switchAuthMode(button.dataset.authMode));
  });

  $("#loginForm")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearMessage();
    try {
      const values = formValues(event.currentTarget);
      await api("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(values),
      });
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
      await api("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(values),
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
      <p>${escapeHtml(user.headline || profile?.focus_area || "AISci member")}</p>
      <div class="portal-meta">
        <span>${escapeHtml(user.email)}</span>
        ${user.organization ? `<span>${escapeHtml(user.organization)}</span>` : ""}
        ${user.country ? `<span>${escapeHtml(user.country)}</span>` : ""}
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
        <p>Create a talent passport, lab proposal, or capital thesis to enter the AISci graph.</p>
      </div>
    `;
    return;
  }

  target.innerHTML = submissions
    .map((submission) => {
      const title =
        submission.payload.focusArea ||
        submission.payload.labName ||
        submission.payload.investorName ||
        submission.type;
      return `
        <article class="submission-item">
          <span>${escapeHtml(ROLE_LABELS[submission.type] || submission.type)} · ${escapeHtml(submission.status)}</span>
          <h3>${escapeHtml(title)}</h3>
          <p>${escapeHtml(new Date(submission.created_at).toLocaleString())}</p>
        </article>
      `;
    })
    .join("");
}

async function initDashboard() {
  const gate = $("#dashboardGate");
  try {
    const [{ user, profile }, submissionData] = await Promise.all([
      api("/api/me"),
      api("/api/submissions"),
    ]);
    if (gate) {
      gate.hidden = true;
    }
    renderUser(user, profile);
    renderSubmissions(submissionData.submissions || []);
  } catch (error) {
    if (gate) {
      gate.innerHTML = authPrompt();
      gate.hidden = false;
    }
    showMessage(error.message, error.status === 401 ? "info" : "error");
  }

  $("#logoutButton")?.addEventListener("click", async () => {
    try {
      await api("/api/auth/logout", { method: "POST", body: "{}" });
    } finally {
      window.location.href = "/";
    }
  });
}

function activeIntakeType() {
  const fromUrl = new URLSearchParams(window.location.search).get("type");
  return ["talent", "lab", "capital"].includes(fromUrl) ? fromUrl : "talent";
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

function collectPayload(type, values) {
  if (type === "talent") {
    return {
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

  return {
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

async function initIntake() {
  const gate = $("#intakeGate");
  setIntakeType(activeIntakeType());
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
        body: JSON.stringify({ type, payload: collectPayload(type, values) }),
      });
      showMessage("Saved. Atlas can now route this into the AISci graph.", "success");
      event.currentTarget.reset();
      setIntakeType(type);
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

initPortal();
