// Saving from the site. A static site cannot save by itself, so this talks
// to the GitHub API with a key kept in this browser (see /settings/):
// class ticks go into content/progress.json, "Approve" edits a lesson file,
// "Plan with Claude" starts the plan-lesson workflow, "Make a CRT plan"
// starts the crt-plan workflow, and a draft unit can be approved or sent
// back to the plan-unit workflow. The Planning page (planning.js) uses the
// same helpers through window.steamHub.

(() => {
  const REPO = document.body.dataset.repo;
  const BRANCH = document.body.dataset.branch || "main";
  const PROGRESS_PATH = "content/progress.json";
  const PLAN = { workflow: "plan-lesson.yml" };
  const KEY = "steamhub.githubToken";
  const API = "https://api.github.com";

  // ---- Key storage (browser storage can be unavailable, e.g. private mode)
  const getToken = () => { try { return localStorage.getItem(KEY) || ""; } catch { return ""; } };
  const setToken = (t) => { try { t ? localStorage.setItem(KEY, t) : localStorage.removeItem(KEY); return true; } catch { return false; } };

  // ---- GitHub API
  async function gh(path, options = {}) {
    const res = await fetch(API + path, {
      // GitHub lets browsers reuse a read for 60 seconds, which would hand
      // back an out of date copy (and an old sha) after a save.
      cache: "no-store",
      ...options,
      headers: {
        Accept: "application/vnd.github+json",
        // Without a key, public reads (like checking a planning run) still work.
        ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
        "X-GitHub-Api-Version": "2022-11-28",
        ...(options.body ? { "Content-Type": "application/json" } : {}),
      },
    });
    return res;
  }
  const toBase64 = (text) => {
    const bytes = new TextEncoder().encode(text);
    let bin = "";
    bytes.forEach((b) => { bin += String.fromCharCode(b); });
    return btoa(bin);
  };
  const fromBase64 = (b64) => new TextDecoder().decode(Uint8Array.from(atob(b64.replace(/\s/g, "")), (c) => c.charCodeAt(0)));

  async function readFile(path) {
    const res = await gh(`/repos/${REPO}/contents/${path}?ref=${BRANCH}`);
    if (res.status === 404) return { text: null, sha: undefined };
    if (!res.ok) throw new Error(await problem(res));
    const json = await res.json();
    return { text: fromBase64(json.content), sha: json.sha };
  }

  // Read, change and write a file, retrying if something else saved first.
  async function updateFile(path, change, message) {
    for (let attempt = 0; attempt < 3; attempt++) {
      const { text, sha } = await readFile(path);
      const next = change(text);
      const res = await gh(`/repos/${REPO}/contents/${path}`, {
        method: "PUT",
        body: JSON.stringify({ message, content: toBase64(next), sha, branch: BRANCH }),
      });
      if (res.ok) return;
      if (res.status !== 409 && res.status !== 422) throw new Error(await problem(res));
    }
    throw new Error("Someone else saved at the same moment. Please try again.");
  }

  async function startWorkflow(workflow, inputs) {
    const res = await gh(`/repos/${REPO}/actions/workflows/${workflow}/dispatches`, {
      method: "POST",
      body: JSON.stringify({ ref: BRANCH, inputs }),
    });
    if (!res.ok) throw new Error(await problem(res));
  }

  async function problem(res) {
    if (res.status === 401) return "GitHub did not accept the key. Check it on the Settings page.";
    if (res.status === 403) return "The key is missing a permission. Check it on the Settings page.";
    let detail = "";
    try { detail = (await res.json()).message || ""; } catch { /* no body */ }
    return `GitHub said ${res.status}${detail ? `: ${detail}` : ""}.`;
  }

  const today = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  };
  const shortDate = (iso) => {
    const [y, m, d] = iso.split("-").map(Number);
    return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-AU", { day: "numeric", month: "short", timeZone: "UTC" });
  };
  const settingsLink = () => document.querySelector('.nav a[href$="/settings/"]')?.href || "/settings/";

  // ---- Class ticks
  const ticks = [...document.querySelectorAll("[data-tick]")];
  const syncLines = [...document.querySelectorAll("[data-sync-status]")];
  const say = (html) => syncLines.forEach((el) => { el.innerHTML = html; });
  let progress = {};
  // Taps are collected and saved together shortly after the last one,
  // as one commit, so ticking a whole row is quick and does not clash.
  const pending = new Map();
  let flushTimer = 0;
  let saving = Promise.resolve();
  let inFlight = 0;

  function renderTick(btn) {
    const date = btn.dataset.date;
    btn.setAttribute("aria-pressed", date ? "true" : "false");
    if (btn.classList.contains("tick-cell")) {
      btn.innerHTML = `<span class="tick-mark" aria-hidden="true">${date ? "✓" : ""}</span>`;
      btn.title = date ? `${btn.dataset.class} finished Lesson ${btn.dataset.lesson} on ${shortDate(date)}` : (btn.disabled ? btn.title : "");
    } else {
      btn.innerHTML = `<span class="tick-name">${btn.dataset.class}</span><span class="tick-date">${date ? shortDate(date) : "Not yet"}</span>`;
    }
  }

  // "Up to" column: the first lesson the class has not finished.
  function renderRows() {
    document.querySelectorAll("[data-class-row]").forEach((row) => {
      const open = [...row.querySelectorAll("[data-tick]")].find((b) => !b.dataset.date);
      row.querySelector("[data-next]").textContent = open ? `Lesson ${open.dataset.lesson}: ${open.dataset.lessonTitle}` : "All done";
    });
    // Home page at-a-glance panel: one short line per class.
    document.querySelectorAll("[data-glance]").forEach((row) => {
      const mine = ticks.filter((b) => b.dataset.unit === row.dataset.unit && b.dataset.class === row.dataset.class && b.classList.contains("tick-cell"));
      if (!mine.length) return;
      mine.forEach((b) => row.querySelector(`[data-n="${b.dataset.lesson}"]`)?.classList.toggle("on", Boolean(b.dataset.date)));
      const open = mine.find((b) => !b.dataset.date);
      const text = open ? `L${open.dataset.lesson} ${open.dataset.lessonTitle}` : "All done";
      row.querySelector("[data-glance-next]").textContent = text;
      row.title = `${row.dataset.class}: ${open ? `Lesson ${open.dataset.lesson}: ${open.dataset.lessonTitle}` : "All done"}`;
    });
  }

  function applyProgress(data) {
    progress = data || {};
    ticks.forEach((btn) => {
      btn.dataset.date = ((progress[btn.dataset.unit] || {})[btn.dataset.lesson] || {})[btn.dataset.class] || "";
      renderTick(btn);
    });
    renderRows();
  }

  async function loadProgress() {
    try {
      if (getToken()) {
        const { text } = await readFile(PROGRESS_PATH);
        applyProgress(text ? JSON.parse(text) : {});
      } else {
        // Without a key, read the copy published with the site.
        const url = document.getElementById("progress-url").href;
        const res = await fetch(`${url}?t=${Date.now()}`, { cache: "no-store" });
        if (res.ok) applyProgress(await res.json());
      }
    } catch { /* keep what the page was built with */ }
  }

  function toggle(btn) {
    if (!getToken()) {
      say(`To tick classes on this device, add your GitHub key on <a href="${settingsLink()}">Settings</a>.`);
      return;
    }
    const { unit, lesson, class: cls, unitTitle, lessonTitle } = btn.dataset;
    const date = btn.dataset.date ? "" : today();
    // Update every matching button straight away, then save in order.
    ticks.filter((b) => b.dataset.unit === unit && b.dataset.lesson === lesson && b.dataset.class === cls)
      .forEach((b) => { b.dataset.date = date; renderTick(b); });
    renderRows();
    pending.set(`${unit}|${lesson}|${cls}`, { unit, lesson, cls, date, unitTitle, lessonTitle });
    say("Saving...");
    clearTimeout(flushTimer);
    flushTimer = setTimeout(flush, 1200);
  }

  function commitMessage(changes) {
    if (changes.length === 1) {
      const c = changes[0];
      return c.date ? `${c.cls} finished ${c.unitTitle} Lesson ${c.lesson}: ${c.lessonTitle}` : `${c.cls} not finished ${c.unitTitle} Lesson ${c.lesson} (untick)`;
    }
    const list = (items) => items.map((c) => `${c.cls} L${c.lesson}`).join(", ");
    const done = changes.filter((c) => c.date), undone = changes.filter((c) => !c.date);
    return [`Class ticks for ${changes[0].unitTitle}:`, done.length ? `finished ${list(done)}` : "", undone.length ? `unticked ${list(undone)}` : ""].filter(Boolean).join(" ");
  }

  function flush() {
    const changes = [...pending.values()];
    pending.clear();
    if (!changes.length) return;
    inFlight++;
    saving = saving.then(() => updateFile(PROGRESS_PATH, (text) => {
      const data = text ? JSON.parse(text) : {};
      for (const { unit, lesson, cls, date } of changes) {
        data[unit] = data[unit] || {};
        data[unit][lesson] = data[unit][lesson] || {};
        if (date) data[unit][lesson][cls] = date;
        else delete data[unit][lesson][cls];
        if (!Object.keys(data[unit][lesson]).length) delete data[unit][lesson];
        if (!Object.keys(data[unit]).length) delete data[unit];
      }
      return JSON.stringify(data, null, 2) + "\n";
    }, commitMessage(changes))).then(
      () => { if (!pending.size && inFlight === 1) say("Saved."); },
      (err) => { say(`Not saved. ${err.message}`); loadProgress(); }
    ).finally(() => { inFlight--; });
  }

  // Save straight away if the page is being hidden, and warn before
  // leaving while a save is still going.
  document.addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden") { clearTimeout(flushTimer); flush(); } });
  addEventListener("beforeunload", (e) => { if (pending.size || inFlight) e.preventDefault(); });

  if (ticks.length) {
    ticks.forEach((btn) => btn.addEventListener("click", () => toggle(btn)));
    if (!getToken()) say(`Showing saved ticks. To tick on this device, add your GitHub key on <a href="${settingsLink()}">Settings</a>.`);
    loadProgress();
  }

  // ---- Claude runs: planning (unit page), reviewing a draft and CRT plans
  // (lesson page). A job is { workflow, title? }: when a title is given,
  // only runs with that name count (CRT runs are named per lesson).
  async function latestRun(job) {
    const res = await gh(`/repos/${REPO}/actions/workflows/${job.workflow}/runs?per_page=10&event=workflow_dispatch`);
    const runs = res.ok ? (await res.json()).workflow_runs : [];
    return runs.find((r) => !job.title || r.display_title === job.title) || null;
  }

  // Follows the latest run. "since" skips runs from before this page
  // started one; 0 means follow whatever run is going now.
  function watchRun(job, status, doneText, since = Date.now()) {
    const check = async () => {
      try {
        const run = await latestRun(job);
        if (run && Date.parse(run.created_at) > since - 120000) {
          const link = `<a href="${run.html_url}" target="_blank" rel="noopener">watch on GitHub</a>`;
          if (run.status !== "completed") {
            const mins = Math.max(1, Math.round((Date.now() - Date.parse(run.created_at)) / 60000));
            status.innerHTML = `Claude is working on it (${mins} min so far, ${link}). You can leave this page.`;
          } else if (run.conclusion === "success") {
            status.innerHTML = `${doneText} The site takes a couple of minutes to update, then reload this page.`;
            return;
          } else {
            status.innerHTML = `That did not finish (${run.conclusion}). See what happened: ${link}.`;
            return;
          }
        }
      } catch { /* try again shortly */ }
      setTimeout(check, 15000);
    };
    check();
  }

  async function plan(job, card, notes, doneText, inputs = { unit: card.dataset.unit, lesson: String(card.dataset.lesson) }) {
    const status = card.querySelector("[data-status]");
    if (!getToken()) {
      status.innerHTML = `Add your GitHub key on <a href="${settingsLink()}">Settings</a> first.`;
      return;
    }
    status.textContent = "Starting...";
    try {
      await startWorkflow(job.workflow, { ...inputs, notes });
      lock(card);
      watchRun(job, status, doneText);
    } catch (err) {
      status.textContent = err.message;
    }
  }

  const lock = (card) => card.querySelectorAll("button, textarea").forEach((el) => { el.disabled = true; });

  // If a plan is already running (started earlier or on another device),
  // show its progress instead of offering to start another.
  async function showRunning(job, card, doneText) {
    try {
      const run = await latestRun(job);
      if (run && run.status !== "completed") {
        lock(card);
        watchRun(job, card.querySelector("[data-status]"), doneText, 0);
      }
    } catch { /* leave the buttons as they are */ }
  }

  const planCard = document.querySelector("[data-plan]");
  if (planCard) showRunning(PLAN, planCard, "The new lesson is ready as a draft.");
  planCard?.querySelector("[data-start-plan]")?.addEventListener("click", () => {
    plan(PLAN, planCard, planCard.querySelector("[data-notes]").value.trim(), `Lesson ${planCard.dataset.lesson} is ready as a draft.`);
  });

  const review = document.querySelector("[data-review]");
  if (review) {
    showRunning(PLAN, review, "Claude has updated the draft.");
    const status = review.querySelector("[data-status]");
    review.querySelector("[data-revise]").addEventListener("click", () => {
      const notes = review.querySelector("[data-notes]").value.trim();
      if (!notes) { status.textContent = "Write what you would like changed first."; return; }
      plan(PLAN, review, notes, "Claude has updated the draft.");
    });
    review.querySelector("[data-approve]").addEventListener("click", async () => {
      if (!getToken()) { status.innerHTML = `Add your GitHub key on <a href="${settingsLink()}">Settings</a> first.`; return; }
      status.textContent = "Approving...";
      try {
        await updateFile(review.dataset.path, (text) => {
          if (!/^status:\s*draft\s*$/m.test(text || "")) throw new Error("This lesson is no longer a draft.");
          return text.replace(/^status:\s*draft\s*$/m, "status: planned");
        }, `Approve Lesson ${review.dataset.lesson}: ${review.dataset.lessonTitle}`);
        review.querySelectorAll("button").forEach((b) => { b.disabled = true; });
        status.textContent = "Approved. The site updates in a minute or two.";
      } catch (err) {
        status.textContent = err.message;
      }
    });
  }

  // A draft unit written from the Planning page.
  const unitReview = document.querySelector("[data-unit-review]");
  if (unitReview) {
    const status = unitReview.querySelector("[data-status]");
    const planId = unitReview.dataset.plan;
    // Matches the run-name in .github/workflows/plan-unit.yml.
    const job = { workflow: "plan-unit.yml", title: `Plan unit: ${planId} (revise)` };
    if (planId) showRunning(job, unitReview, "Claude has updated the draft unit.");
    unitReview.querySelector("[data-revise]")?.addEventListener("click", () => {
      const notes = unitReview.querySelector("[data-notes]").value.trim();
      if (!notes) { status.textContent = "Write what you would like changed first."; return; }
      plan(job, unitReview, notes, "Claude has updated the draft unit.", { plan: planId, round: "revise" });
    });
    unitReview.querySelector("[data-approve]").addEventListener("click", async () => {
      if (!getToken()) { status.innerHTML = `Add your GitHub key on <a href="${settingsLink()}">Settings</a> first.`; return; }
      status.textContent = "Approving...";
      try {
        await updateFile(unitReview.dataset.path, (text) => {
          if (!/^status:\s*draft\s*$/m.test(text || "")) throw new Error("This unit is no longer a draft.");
          return text.replace(/^status:\s*draft\s*$/m, "status: planned");
        }, `Approve unit: ${unitReview.dataset.unitTitle}`);
        unitReview.querySelectorAll("button, textarea").forEach((b) => { b.disabled = true; });
        status.textContent = "Approved. The site updates in a minute or two.";
      } catch (err) {
        status.textContent = err.message;
      }
    });
  }

  const crt = document.querySelector("[data-crt]");
  if (crt) {
    // Matches the run-name in .github/workflows/crt-plan.yml.
    const job = { workflow: "crt-plan.yml", title: `CRT plan: ${crt.dataset.unit} Lesson ${crt.dataset.lesson}` };
    const done = "The CRT plan is ready.";
    showRunning(job, crt, done);
    crt.querySelector("[data-start-crt]").addEventListener("click", () => {
      plan(job, crt, crt.querySelector("[data-notes]").value.trim(), done);
    });
  }

  // Home page: the "Tick classes" link opens the tick tables.
  document.querySelectorAll('a[href="#tick-classes"]').forEach((a) => a.addEventListener("click", () => {
    const d = document.querySelector("#tick-classes details");
    if (d) d.open = true;
  }));

  // ---- Accordions: expand or collapse all
  document.querySelector("[data-expand-all]")?.addEventListener("click", (e) => {
    const all = [...document.querySelectorAll("details.acc")];
    const open = all.some((d) => !d.open);
    all.forEach((d) => { d.open = open; });
    e.currentTarget.textContent = open ? "Collapse all" : "Expand all";
  });

  // Shared with the Planning page script.
  window.steamHub = { getToken, readFile, updateFile, startWorkflow, latestRun, watchRun, problem, settingsLink };

  // ---- Settings page
  const settings = document.querySelector("[data-settings]");
  if (settings) {
    const status = settings.querySelector("[data-status]");
    const state = settings.querySelector("[data-key-state]");
    const input = settings.querySelector("[data-token-input]");
    const showState = () => {
      state.textContent = getToken() ? "This device is connected to GitHub." : "This device is not connected yet.";
    };
    showState();
    settings.querySelector("[data-token-save]").addEventListener("click", async () => {
      const value = input.value.trim();
      if (!value) { status.textContent = "Paste a key first."; return; }
      if (!setToken(value)) { status.textContent = "This browser will not store the key (private browsing?)."; return; }
      input.value = "";
      status.textContent = "Testing...";
      try {
        const repo = await gh(`/repos/${REPO}`);
        if (!repo.ok) throw new Error(await problem(repo));
        const canWrite = (await repo.json()).permissions?.push;
        const actions = await gh(`/repos/${REPO}/actions/workflows`);
        const parts = [canWrite ? "Ticks: ready." : "Ticks: the key needs Contents set to Read and write."];
        parts.push(actions.ok ? "Planning: ready (once the Claude token is set up)." : "Planning: the key needs Actions set to Read and write.");
        status.textContent = parts.join(" ");
      } catch (err) {
        status.textContent = err.message;
      }
      showState();
    });
    settings.querySelector("[data-token-remove]").addEventListener("click", () => {
      setToken("");
      status.textContent = "Removed from this device.";
      showState();
    });
  }
})();
