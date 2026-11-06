// The Planning page. A plan is a JSON file in content/plans/ (see
// PLANNING.md). This script runs the survey, saves the plan through the
// GitHub API (the helpers in hub.js, window.steamHub) and starts the
// plan-unit workflow, where Claude writes the directions and then the
// draft unit. Nothing here stores student details.

(() => {
  const hub = window.steamHub;
  const app = document.querySelector("[data-plan-app]");
  if (!app || !hub) return;

  const read = (id) => JSON.parse(document.getElementById(id).textContent);
  const DATA = read("planning-data");
  const CODES = read("curriculum-data");
  const RESOURCES = read("resources-data");
  const LENSES = read("lenses-data");
  const PLANS_URL = document.getElementById("plans-url").href;
  const WORKFLOW = "plan-unit.yml";
  // Site links in the data start with "/", so put the site's path in front.
  const BASE = PLANS_URL.replace(/plans\/$/, "");
  const site = (url) => BASE + String(url).replace(/^\//, "");
  const VCAA = { VC2S: "science", VC2TDE: "technologies/design-and-technologies", VC2TDI: "technologies/digital-technologies" };
  const vcaa = (code, area) => `https://f10.vcaa.vic.edu.au/learning-areas/${VCAA[area]}/curriculum#${code}`;

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const esc = (t) => String(t ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const today = () => new Date().toLocaleDateString("en-CA", { timeZone: "Australia/Melbourne" });
  const cohortLabel = (id) => (DATA.cohorts.find((c) => c.id === id) || {}).label || id;
  const termLabel = (y, t) => `Term ${t}, ${y}`;
  const band = (cohort) => ({ f: "2", y12: "2", y34: "4", y56: "6" }[cohort] || "2");
  const pathFor = (id) => `content/plans/${id}.json`;
  // Matches the run-name in .github/workflows/plan-unit.yml.
  const job = (id, round) => ({ workflow: WORKFLOW, title: `Plan unit: ${id} (${round})` });
  const keyNote = () => `Add your GitHub key on <a href="${hub.settingsLink()}">Settings</a> to save plans from this device.`;

  // How each question is decided, from "Gut and Evidence in Teaching".
  const LEAN = {
    evidence: ["lean-evidence", "Evidence leads", "This affects the whole cohort and shows results weeks later, so research sets the default. Change it if you have a reason."],
    gut: ["lean-gut", "Your call", "This is about these students and your style. There is no default: your judgement leads."],
    both: ["lean-both", "Both", "Evidence and judgement meet here."],
    fixed: ["lean-fixed", "Fixed", "Set by the school or the calendar."],
  };
  const lean = (kind) => `<span class="lean ${LEAN[kind][0]}" title="${esc(LEAN[kind][2])}">${LEAN[kind][1]}</span>`;

  // ---- Start a new plan
  const newCard = $("[data-plan-new]");
  $("[data-new-start]", newCard).addEventListener("click", async () => {
    const status = $("[data-status]", newCard);
    if (!hub.getToken()) { status.innerHTML = keyNote(); return; }
    const cohort = $("[data-new-cohort]", newCard).value;
    const year = Number($("[data-new-year]", newCard).value);
    const term = Number($("[data-new-term]", newCard).value);
    const lessons = Number($("[data-new-lessons]", newCard).value) || DATA.lessonCount;
    const id = `${year}-t${term}-${cohort}`;
    status.textContent = "Starting...";
    try {
      const existing = await hub.readFile(pathFor(id));
      if (existing.text) { location.search = `?plan=${id}`; return; }
      const plan = blankPlan(id, cohort, year, term, lessons);
      await hub.updateFile(pathFor(id), () => JSON.stringify(plan, null, 2) + "\n", `Start a plan: ${cohortLabel(cohort)}, ${termLabel(year, term)}`);
      location.search = `?plan=${id}`;
    } catch (err) {
      status.textContent = err.message;
    }
  });

  function blankPlan(id, cohort, year, term, lessons) {
    return {
      id, kind: "unit", cohort, year, term, lesson_count: lessons,
      status: "survey", created: today(), updated: today(),
      answers: {
        targets: [], science_focus: "", report_subject: DATA.reportSubjects[term] || "",
        digital_tech: DATA.reportSubjects[term] === "Digital Technologies",
        must_use: [], cant_use: [], open_to_buying: false,
        checking: "", dates: "", links: "", notes: "",
        spark_on: false, spark: { excites: "", story: "", local: "", loves: "" },
      },
      directions: [], choices: {}, unit: null,
    };
  }

  // ---- Open a plan (?plan=id)
  const planId = new URLSearchParams(location.search).get("plan");
  if (!planId || !/^[a-z0-9-]+$/.test(planId)) return;
  const view = $("[data-plan-view]");
  $("[data-plan-list]").hidden = true;
  newCard.hidden = true;
  view.hidden = false;
  view.innerHTML = `<p class="muted">Loading the plan...</p>`;

  let plan = null;
  load();

  async function load() {
    try {
      if (hub.getToken()) {
        const { text } = await hub.readFile(pathFor(planId));
        plan = text ? JSON.parse(text) : null;
      } else {
        const res = await fetch(`${PLANS_URL}${planId}.json?t=${Date.now()}`, { cache: "no-store" });
        plan = res.ok ? await res.json() : null;
      }
    } catch (err) {
      view.innerHTML = `<p class="ph">Could not load the plan: ${esc(err.message)}</p>`;
      return;
    }
    if (!plan) { view.innerHTML = `<p class="ph">There is no plan called ${esc(planId)}. <a href="./">Back to Planning</a></p>`; return; }
    upgrade(plan.answers);
    render();
  }

  // Plans started before November 2026 ticked any code as a target. Take
  // the Science focus and the Digital Technologies switch from those ticks.
  function upgrade(a) {
    a.targets = a.targets || [];
    if (a.science_focus === undefined) a.science_focus = a.targets.find((c) => CODES[c] && CODES[c].strand === "Science Understanding") || "";
    if (a.digital_tech === undefined) a.digital_tech = a.report_subject === "Digital Technologies" || a.targets.some((c) => CODES[c] && CODES[c].area === "VC2TDI");
  }

  // ---- What the hub already knows
  function context() {
    const key = plan.year * 10 + plan.term;
    const mine = DATA.units.filter((u) => u.cohort === plan.cohort && u.status !== "draft");
    const before = mine.filter((u) => u.termKey < key).sort((a, b) => b.termKey - a.termKey);
    const lastTerm = before[0] || null;
    const lastCycle = mine.find((u) => u.termKey === key - 20) || null;
    const others = DATA.units.filter((u) => u.termKey === key && u.cohort !== plan.cohort);
    // Codes this cohort has covered in the two-year cycle before this term.
    const covered = {};
    mine.filter((u) => u.termKey < key && u.termKey >= key - 20)
      .forEach((u) => u.curriculum.forEach((c) => { (covered[c] ||= []).push(u.title); }));
    const classes = (DATA.classes[String(plan.year)] || DATA.classes[String(plan.year - 1)] || {})[plan.cohort] || [];
    return { lastTerm, lastCycle, others, covered, classes };
  }

  function render() {
    const a = plan.answers;
    const ctx = context();
    const unitLink = (u) => (u ? `<a href="${esc(site(u.url))}">${esc(u.title)}</a> <span class="muted">(${esc(u.termLabel)})</span>` : `<span class="muted">Not in the hub yet</span>`);
    const readOnly = !hub.getToken();
    view.innerHTML = `
      <p class="crumbs"><a href="./">Planning</a> / ${esc(cohortLabel(plan.cohort))}, ${esc(termLabel(plan.year, plan.term))}</p>
      ${readOnly ? `<p class="card amber small">${keyNote()}</p>` : ""}
      <section class="card stack-tight">
        <h2 class="card-title">What the hub knows</h2>
        <dl class="plan-facts">
          <dt>Cohort</dt><dd>${esc(cohortLabel(plan.cohort))}${ctx.classes.length ? ` · ${ctx.classes.map(esc).join(", ")}` : ""}</dd>
          <dt>Lessons</dt><dd><input type="number" min="1" max="12" value="${esc(plan.lesson_count)}" data-field="lesson_count" class="plan-num"> (about 2 lost to school events in a 10-week term)</dd>
          <dt>Last term</dt><dd>${unitLink(ctx.lastTerm)}</dd>
          <dt>Two years ago</dt><dd>${unitLink(ctx.lastCycle)}${ctx.lastCycle ? ` <span class="small muted">Claude offers a remix of it as one direction.</span>` : ""}</dd>
          <dt>Other cohorts this term</dt><dd>${ctx.others.length ? ctx.others.map((u) => `${esc(cohortLabel(u.cohort))}: <a href="${esc(site(u.url))}">${esc(u.title)}</a>`).join(" · ") : `<span class="muted">None planned yet</span>`}</dd>
        </dl>
      </section>

      <section class="card stack" data-survey>
        <div><h2 class="card-title">Non-negotiables</h2><p class="small muted">What can't change. Everything else is open for Claude to suggest.</p></div>
        ${curriculumHtml(ctx)}
        <div class="plan-q">
          <div class="plan-q-head"><h3>Reports</h3>${lean("fixed")}</div>
          <select data-field="report_subject">
            ${["Digital Technologies", "Design and Technologies", "Science", ""].map((s) => `<option value="${esc(s)}"${a.report_subject === s ? " selected" : ""}>${s || "Not for reports"}</option>`).join("")}
          </select>
        </div>
        ${resourcesHtml()}
        <div class="plan-q">
          <div class="plan-q-head"><h3>Checking understanding</h3>${lean("evidence")}</div>
          <p class="small">Default: checks built into every lesson. Success criteria thumbs at the end, one hinge question before the task, and the journal or Book Creator page as evidence. Claude adds two or three easy options for the unit.</p>
          <textarea rows="2" data-field="checking" placeholder="Anything else that has to be assessed, or a format you want">${esc(a.checking)}</textarea>
        </div>
        <div class="plan-q">
          <div class="plan-q-head"><h3>Dates and events</h3>${lean("fixed")}</div>
          <textarea rows="2" data-field="dates" placeholder="e.g. No lesson in Week 3 (swimming). High school lab visit in Week 6.">${esc(a.dates)}</textarea>
        </div>
        <div class="plan-q">
          <div class="plan-q-head"><h3>Links to class learning</h3>${lean("both")}</div>
          <textarea rows="2" data-field="links" placeholder="e.g. Classroom inquiry this term: Living things and their habitats">${esc(a.links)}</textarea>
        </div>
        <div class="plan-q">
          <div class="plan-q-head"><h3>Notes for Claude</h3></div>
          <textarea rows="2" data-field="notes" placeholder="Anything else Claude should know">${esc(a.notes)}</textarea>
        </div>
        <div class="plan-q">
          <label class="plan-toggle"><input type="checkbox" data-field="spark_on"${a.spark_on ? " checked" : ""}> <span><strong>Add your spark</strong> <span class="small muted">(optional)</span></span> ${lean("gut")}</label>
          <div class="stack-tight" data-spark${a.spark_on ? "" : " hidden"}>
            ${[["excites", "What excites you about this topic?"], ["story", "A story you could tell"], ["local", "A local or Country link"], ["loves", "Something this cohort loves"]]
              .map(([k, q]) => `<label class="field"><span class="small strong">${q}</span><textarea rows="2" data-spark-field="${k}">${esc(a.spark[k])}</textarea></label>`).join("")}
          </div>
        </div>
        <div class="actions">
          <button type="button" class="btn btn-outline" data-save>Save</button>
          <button type="button" class="btn" data-ask>${plan.directions.length ? "Ask for new directions" : "Ask Claude for directions"}</button>
        </div>
        <p class="small" data-status role="status"></p>
      </section>

      ${plan.directions.length ? directionsHtml() : ""}
      ${plan.unit && plan.unit.slug ? `<section class="card stack-tight"><h2 class="card-title">Draft unit</h2><p><a class="btn" href="${esc(site(`/units/${plan.unit.slug}/`))}">Open ${esc(plan.unit.title || "the draft unit")}</a></p><p class="small muted">Approve it or ask for changes on the unit page.</p></section>` : ""}
    `;
    wire(readOnly);
  }

  // Curriculum (James, November 2026): one Science Understanding code as
  // the focus, any Design and Technologies codes James wants, and a switch
  // for Digital Technologies. Science Inquiry, Science as a Human Endeavour
  // and the Digital Technologies codes are Claude's: built in where they fit
  // naturally, left out where they don't.
  function curriculumHtml(ctx) {
    const a = plan.answers;
    const level = band(plan.cohort);
    const codesIn = (area, strand) => Object.entries(CODES).filter(([, c]) => c.area === area && c.band === level && (!strand || c.strand === strand));
    const line = (code, c, input) => `<label class="plan-code">${input}
      <span><a class="plan-code-id" href="${vcaa(code, c.area)}" target="_blank" rel="noopener">${code}</a> ${esc(c.summary)}
      ${ctx.covered[code] ? `<span class="small muted">Covered: ${esc(ctx.covered[code].join(", "))}</span>` : `<span class="tag-suggest">Not covered this cycle</span>`}</span>
    </label>`;

    const su = codesIn("VC2S", "Science Understanding");
    const subs = [...new Set(su.map(([, c]) => c.sub))];
    const focus = a.science_focus;
    const science = `<details class="plan-area"${focus ? " open" : ""}>
      <summary><span class="strong">Science Understanding focus</span> <span class="small muted" data-focus-label>${focus ? esc(focus) : ""}</span></summary>
      <label class="plan-code"><input type="radio" name="science-focus" value="" data-focus${focus ? "" : " checked"}><span>No Science focus this unit</span></label>
      ${subs.map((sub) => `<p class="plan-strand">${esc(sub)}</p>` + su.filter(([, c]) => c.sub === sub)
        .map(([code, c]) => line(code, c, `<input type="radio" name="science-focus" value="${code}" data-focus${focus === code ? " checked" : ""}>`)).join("")).join("")}
    </details>`;

    const chosen = new Set(a.targets);
    const de = codesIn("VC2TDE");
    const picked = de.filter(([code]) => chosen.has(code)).length;
    const design = `<details class="plan-area"${picked ? " open" : ""}>
      <summary><span class="strong">Design and Technologies</span> <span class="small muted" data-count>${picked ? `${picked} chosen` : ""}</span></summary>
      ${[...new Set(de.map(([, c]) => c.strand))].map((st) => `<p class="plan-strand">${esc(st)}</p>` + de.filter(([, c]) => c.strand === st)
        .map(([code, c]) => line(code, c, `<input type="checkbox" value="${code}" data-target${chosen.has(code) ? " checked" : ""}>`)).join("")).join("")}
    </details>`;

    return `<div class="plan-q">
      <div class="plan-q-head"><h3>Curriculum</h3>${lean("evidence")}</div>
      <p class="small">Choose one Science Understanding code as the focus. Science Inquiry and Science as a Human Endeavour are not chosen here: Claude builds them in wherever they fit naturally and leaves them out where they don't. Codes this cohort has not covered in the last two years are marked.</p>
      ${science}
      <div>
        <label class="plan-toggle"><input type="checkbox" data-field="digital_tech"${a.digital_tech ? " checked" : ""}> <strong>Complement with Digital Technologies</strong></label>
        <p class="small muted">Claude includes the Digital Technologies codes that fit the Science naturally, and none that don't.</p>
      </div>
      ${design}
      <p class="small muted">Claude also suggests links to other learning areas.</p>
    </div>`;
  }

  // Resources: must use, don't use, or leave it to Claude.
  function resourcesHtml() {
    const a = plan.answers;
    const owned = Object.entries(RESOURCES).filter(([, r]) => r.owned && r.levels.includes(band(plan.cohort)));
    const val = (id) => (a.must_use.includes(id) ? "must" : a.cant_use.includes(id) ? "cant" : "");
    return `<div class="plan-q">
      <div class="plan-q-head"><h3>Resources and spaces</h3>${lean("gut")}</div>
      <p class="small">Leave everything as "Optional" unless it must be used or must not be.</p>
      <div class="plan-res">
        ${owned.map(([id, r]) => `<label class="plan-res-row"><span>${esc(r.name)}${r.count ? ` <span class="small muted">(${r.count}${r.confirm ? "?" : ""})</span>` : ""}</span>
          <select data-resource="${id}">
            <option value=""${val(id) === "" ? " selected" : ""}>Optional</option>
            <option value="must"${val(id) === "must" ? " selected" : ""}>Must use</option>
            <option value="cant"${val(id) === "cant" ? " selected" : ""}>Don't use</option>
          </select></label>`).join("")}
      </div>
      <label class="plan-toggle"><input type="checkbox" data-field="open_to_buying"${a.open_to_buying ? " checked" : ""}> Open to buying something new</label>
    </div>`;
  }

  // ---- Directions and pick and mix
  const PARTS = [
    ["big_idea", "Big idea and LISC"],
    ["assessment", "Assessment"],
    ["arc", "Lesson arc"],
    ["resources", "Resources"],
    ["connections", "Connections"],
  ];
  const resName = (id) => (RESOURCES[id] ? RESOURCES[id].name : id);
  const lensName = (id) => (LENSES[id] ? LENSES[id].label : id);

  function directionHtml(d) {
    const list = (items, fn) => (items && items.length ? `<ul class="list">${items.map(fn).join("")}</ul>` : `<p class="small muted">None</p>`);
    return `<article class="card direction stack-tight">
      <p class="kicker">Direction ${esc(d.id)}${d.type ? ` · ${esc(d.type)}` : ""}</p>
      <h3 class="direction-title">${esc(d.title)}</h3>
      <p><strong>Big idea:</strong> ${esc(d.big_idea)}</p>
      ${d.lisc ? `<div class="direction-lisc"><p class="small strong">Learning Intention</p><p>${esc(d.lisc.intention)}</p><p class="small strong">Success Criteria: I can</p>${list(d.lisc.criteria, (c) => `<li>${esc(c)}</li>`)}</div>` : ""}
      ${d.built_in ? `<p class="small strong">Built in where it fits</p>${list(d.built_in, (c) => `<li>${CODES[c.code] ? `<a href="${vcaa(c.code, CODES[c.code].area)}" target="_blank" rel="noopener">${esc(c.code)}</a>` : esc(c.code)}: ${esc(c.how)}</li>`)}` : ""}
      <p class="small strong">Assessment</p>${list(d.assessment, (x) => `<li><strong>${esc(x.title)}</strong>${x.when ? ` <span class="muted">(${esc(x.when)})</span>` : ""}. ${esc(x.how)}</li>`)}
      <p class="small strong">Lesson arc</p><ol class="list">${(d.arc || []).map((l) => `<li><strong>${esc(l.title)}</strong>: ${esc(l.summary)}</li>`).join("")}</ol>
      <p class="small strong">Resources</p>${list(d.resources, (r) => `<li>${esc(resName(r.id))}${r.why ? `: ${esc(r.why)}` : ""}</li>`)}
      ${d.purchases && d.purchases.length ? `<p class="small strong">Would need buying</p>${list(d.purchases, (r) => `<li>${esc(r.name)}${r.why ? `: ${esc(r.why)}` : ""}</li>`)}` : ""}
      <p class="small strong">Connections</p>${list(d.connections, (c) => `<li>${esc(c.code)}: ${esc(c.how)}</li>`)}
      <div class="direction-split">
        <div><p class="small strong">${lean("evidence")} Evidence backbone</p>${list(d.backbone, (x) => `<li>${esc(x)}</li>`)}</div>
        <div><p class="small strong">${lean("gut")} Flair to take or leave</p>${list(d.flair, (x) => `<li>${esc(x)}</li>`)}</div>
      </div>
      ${d.pedagogy && d.pedagogy.length ? `<p class="small muted">Leans on: ${d.pedagogy.map((p) => esc(lensName(p.id))).join(", ")}</p>` : ""}
    </article>`;
  }

  function directionsHtml() {
    const ch = plan.choices || {};
    const ids = plan.directions.map((d) => d.id);
    return `<section class="stack">
      <div><h2 class="section-title">Directions</h2><p class="small muted">Three different ways the unit could go. Pick each part from any direction, or write your own.</p></div>
      <div class="directions">${plan.directions.map(directionHtml).join("")}</div>
      <section class="card stack" data-choose>
        <h2 class="card-title">Pick and mix</h2>
        ${PARTS.map(([part, label]) => {
          const c = ch[part] || {};
          return `<fieldset class="plan-pick">
            <legend class="strong">${label}</legend>
            <div class="plan-pick-options">
              ${ids.map((id) => `<label><input type="radio" name="pick-${part}" value="${esc(id)}"${c.from === id ? " checked" : ""}> ${esc(id)}</label>`).join("")}
              <label><input type="radio" name="pick-${part}" value="own"${c.from === "own" ? " checked" : ""}> My own</label>
            </div>
            <textarea rows="2" data-own="${part}"${c.from === "own" ? "" : " hidden"} placeholder="Write your own ${label.toLowerCase()}">${esc(c.own || "")}</textarea>
          </fieldset>`;
        }).join("")}
        <label class="field"><span class="small strong">Notes for Claude</span><textarea rows="2" data-choose-notes placeholder="e.g. Use A's big idea but keep the garden from C">${esc(ch.notes || "")}</textarea></label>
        <div class="actions">
          <button type="button" class="btn btn-outline" data-save-choices>Save choices</button>
          <button type="button" class="btn" data-write>Write the draft unit</button>
        </div>
        <p class="small" data-status role="status"></p>
      </section>
    </section>`;
  }

  // ---- Reading the form back into the plan
  function collect() {
    const a = plan.answers;
    const survey = $("[data-survey]", view);
    const focus = $("[data-focus]:checked", survey);
    a.science_focus = focus ? focus.value : "";
    // Must-cover codes: the Science focus and any Design and Technologies codes.
    a.targets = [a.science_focus, ...$$("[data-target]:checked", survey).map((el) => el.value)].filter(Boolean);
    $$("[data-field]", view).forEach((el) => {
      const f = el.dataset.field;
      if (f === "lesson_count") plan.lesson_count = Number(el.value) || plan.lesson_count;
      else if (el.type === "checkbox") a[f] = el.checked;
      else a[f] = el.value.trim();
    });
    $$("[data-spark-field]", view).forEach((el) => { a.spark[el.dataset.sparkField] = el.value.trim(); });
    a.must_use = $$("[data-resource]", view).filter((el) => el.value === "must").map((el) => el.dataset.resource);
    a.cant_use = $$("[data-resource]", view).filter((el) => el.value === "cant").map((el) => el.dataset.resource);
    const choose = $("[data-choose]", view);
    if (choose) {
      plan.choices = { notes: $("[data-choose-notes]", choose).value.trim() };
      PARTS.forEach(([part]) => {
        const picked = $(`input[name="pick-${part}"]:checked`, choose);
        plan.choices[part] = { from: picked ? picked.value : "", own: $(`[data-own="${part}"]`, choose).value.trim() };
      });
    }
    plan.updated = today();
  }

  // Saves the answers and choices only, so a save never undoes what Claude
  // has written to the plan in the meantime.
  async function save(message) {
    collect();
    const mine = { answers: plan.answers, choices: plan.choices, lesson_count: plan.lesson_count, updated: plan.updated };
    await hub.updateFile(pathFor(plan.id), (text) => {
      const current = text ? JSON.parse(text) : plan;
      Object.assign(current, mine);
      plan = current;
      return JSON.stringify(current, null, 2) + "\n";
    }, message);
  }

  function wire(readOnly) {
    const survey = $("[data-survey]", view);
    const status = $("[data-status]", survey);
    $("[data-field=spark_on]", view).addEventListener("change", (e) => { $("[data-spark]", view).hidden = !e.target.checked; });
    $$(".plan-area", view).forEach((d) => d.addEventListener("change", () => {
      const count = $("[data-count]", d);
      if (count) { const n = $$("[data-target]:checked", d).length; count.textContent = n ? `${n} chosen` : ""; }
      const label = $("[data-focus-label]", d);
      if (label) { const f = $("[data-focus]:checked", d); label.textContent = f ? f.value : ""; }
    }));
    $$("[data-choose] input[type=radio]", view).forEach((r) => r.addEventListener("change", () => {
      const part = r.name.replace("pick-", "");
      $(`[data-own="${part}"]`, view).hidden = r.value !== "own";
    }));
    if (readOnly) { $$("button, input, select, textarea", view).forEach((el) => { el.disabled = true; }); return; }

    $("[data-save]", survey).addEventListener("click", async () => {
      status.textContent = "Saving...";
      try { await save(`Plan ${plan.id}: answers`); status.textContent = "Saved."; } catch (err) { status.textContent = err.message; }
    });
    $("[data-ask]", survey).addEventListener("click", () => run("directions", survey, "Directions are ready."));

    const choose = $("[data-choose]", view);
    if (choose) {
      const cStatus = $("[data-status]", choose);
      $("[data-save-choices]", choose).addEventListener("click", async () => {
        cStatus.textContent = "Saving...";
        try { await save(`Plan ${plan.id}: choices`); cStatus.textContent = "Saved."; } catch (err) { cStatus.textContent = err.message; }
      });
      $("[data-write]", choose).addEventListener("click", () => {
        collect();
        const missing = PARTS.filter(([part]) => !plan.choices[part].from).map(([, label]) => label);
        if (missing.length) { cStatus.textContent = `Pick something for: ${missing.join(", ")}.`; return; }
        run("draft", choose, "The draft unit is ready.");
      });
    }

    // A run already going (started here earlier or on another device).
    ["directions", "draft"].forEach(async (round) => {
      const card = round === "directions" ? survey : choose;
      if (!card) return;
      try {
        const r = await hub.latestRun(job(plan.id, round));
        if (r && r.status !== "completed") watch(round, card, round === "directions" ? "Directions are ready." : "The draft unit is ready.", 0);
      } catch { /* leave the buttons */ }
    });
  }

  async function run(round, card, doneText) {
    const status = $("[data-status]", card);
    status.textContent = "Saving...";
    try {
      await save(`Plan ${plan.id}: ${round === "directions" ? "answers" : "choices"}`);
      status.textContent = "Starting Claude...";
      await hub.startWorkflow(WORKFLOW, { plan: plan.id, round, notes: "" });
      watch(round, card, doneText);
    } catch (err) {
      status.textContent = err.message;
    }
  }

  function watch(round, card, doneText, since = Date.now()) {
    $$("button, textarea, input, select", view).forEach((el) => { el.disabled = true; });
    hub.watchRun(job(plan.id, round), $("[data-status]", card), doneText, since);
  }
})();
