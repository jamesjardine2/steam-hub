// Loads everything in content/ and works out the derived values
// (planned counts, next to plan, next taught, latest reflections,
// where each class is up to).
// Templates only render what this file returns.

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import markdownIt from "markdown-it";
import { linkVc2 } from "../../lib/vc2.js";

const REPO = "jamesjardine2/steam-hub";
const BRANCH = "main";
const CONTENT = path.join(process.cwd(), "content");
const DEFAULT_LESSON_COUNT = 8;
const DEFAULT_DURATION = 45;

const COHORTS = [
  { id: "f", label: "Foundation" },
  { id: "y12", label: "Year 1/2" },
  { id: "y34", label: "Year 3/4" },
  { id: "y56", label: "Year 5/6" },
];
const VTLM = [
  "Focus the learning",
  "Explicit explanation and modelling",
  "Scaffold practice",
  "Monitor progress",
];
const CITW = [
  "CICs",
  "Vocabulary",
  "Frayer model",
  "Strategy instruction and modelling",
  "Worked examples",
];

// Pedagogy tags: the vocabulary is src/_data/lenses.json. A lesson's
// `pedagogy` map gives each tag id a level (focus or present) and `how`:
// one or more statements on how this lesson uses that practice.
const LENSES_FILE = path.join(process.cwd(), "src", "_data", "lenses.json");
const LENSES = (() => {
  try {
    return JSON.parse(fs.readFileSync(LENSES_FILE, "utf8")).nodes || {};
  } catch (e) {
    console.warn(`[steam-hub] src/_data/lenses.json: could not be read: ${e.message}`);
    return {};
  }
})();
const LEVELS = ["focus", "present"];
const TIERS = [
  { id: "department", label: "Department" },
  { id: "adopted", label: "School-adopted" },
  { id: "fcps", label: "FCPS" },
  { id: "curriculum", label: "Curriculum" },
];

const md = markdownIt({ html: true, linkify: true });

function renderMd(text) {
  if (!text || !text.trim()) return "";
  // Paragraphs that start with "[" are placeholders.
  // Curriculum codes link to the Victorian Curriculum site.
  return linkVc2(md.render(text).replace(/<p>\[/g, '<p class="ph">['));
}

function warn(file, message) {
  console.warn(`[steam-hub] ${path.relative(process.cwd(), file)}: ${message}`);
}

function readMatter(file) {
  return matter(fs.readFileSync(file, "utf8"));
}

function listDir(dir) {
  return fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => !f.startsWith(".")).sort() : [];
}

function termLabel(year, term) {
  return `Term ${term}, ${year}`;
}

function formatDate(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

function formatShortDate(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-AU", { day: "numeric", month: "short", timeZone: "UTC" });
}

function readJson(file, fallback) {
  if (!fs.existsSync(file)) return fallback;
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (e) {
    warn(file, `could not be read: ${e.message}`);
    return fallback;
  }
}

// A lesson body becomes an intro plus one accordion section per "## " heading.
function splitSections(text) {
  const parts = text.split(/^## +/m);
  const intro = parts.shift();
  return {
    introHtml: renderMd(intro),
    sections: parts.map((part) => {
      const newline = part.indexOf("\n");
      return {
        title: (newline === -1 ? part : part.slice(0, newline)).trim(),
        html: renderMd(newline === -1 ? "" : part.slice(newline + 1)),
      };
    }),
  };
}

function asList(value) {
  if (value == null || value === "") return [];
  return Array.isArray(value) ? value : [value];
}

function liscFrom(raw) {
  if (!raw || !raw.intention) return null;
  const criteria = asList(raw.criteria);
  const text = [
    "Learning Intention:",
    raw.intention,
    "",
    "Success Criteria:",
    "I can:",
    ...criteria.map((c) => `- ${c}`),
  ].join("\n");
  return { intention: raw.intention, criteria, text };
}

function checkValues(file, field, values, allowed) {
  for (const v of values) {
    if (!allowed.includes(v)) warn(file, `unknown ${field} value "${v}" (allowed: ${allowed.join("; ")})`);
  }
}

// A tag's source: its own link, else the nearest parent's (marked as the
// broader source), else null, which the page shows as "add link".
function lensSource(id) {
  const own = LENSES[id];
  let node = own;
  while (node) {
    if (node.source_url) {
      return {
        url: node.source_url,
        label: node.source_label || node.label,
        login: Boolean(node.requires_login || own.requires_login),
        inherited: node !== own,
      };
    }
    node = LENSES[node.parent];
  }
  return null;
}

function lensRow(id, level, how = []) {
  const n = LENSES[id];
  const tierIndex = TIERS.findIndex((t) => t.id === n.tier);
  return {
    id,
    level,
    levelLabel: level === "focus" ? "Focus" : "Present",
    how,
    // Curriculum codes in a statement link to the VCAA site, like lesson text.
    howHtml: how.map((h) => linkVc2(md.utils.escapeHtml(h))),
    label: n.label,
    tier: n.tier,
    tierIndex: tierIndex < 0 ? TIERS.length : tierIndex,
    icon: n.icon || "ti-tag",
    path: asList(n.path).join(" › "),
    source: lensSource(id),
    missingLabel: n.source_label || n.label,
    further: asList(n.further).filter((f) => f && f.url),
    routine: Boolean(n.routine),
  };
}

// Checks a lesson's pedagogy map against lenses.json. Each entry is
//   tag.id: { level: focus, how: "..." }   (how can also be a list)
// A bare level still works, with a warning until a statement is added.
// Routines are left out: the unit page lists them once as "Built into
// every lesson".
function loadPedagogy(file, raw) {
  if (raw == null) return {};
  if (typeof raw !== "object" || Array.isArray(raw)) {
    warn(file, "pedagogy should be a map of tag id to focus or present");
    return {};
  }
  const tags = {};
  for (const [id, value] of Object.entries(raw)) {
    const entry = value && typeof value === "object" ? value : { level: value };
    const level = String(entry.level).toLowerCase();
    const how = asList(entry.how).map((h) => String(h).trim()).filter(Boolean);
    if (!LENSES[id]) { warn(file, `unknown pedagogy tag "${id}" (not in lenses.json)`); continue; }
    if (!LEVELS.includes(level)) { warn(file, `pedagogy tag "${id}" has level "${value}" (use focus or present)`); continue; }
    if (LENSES[id].routine) continue;
    if (!how.length) warn(file, `pedagogy tag "${id}" needs a how statement saying how this lesson uses it`);
    tags[id] = { level, how };
  }
  return tags;
}

function pedagogyRows(tags) {
  return Object.entries(tags)
    .map(([id, t]) => lensRow(id, t.level, t.how))
    .sort((a, b) => (a.level === b.level ? 0 : a.level === "focus" ? -1 : 1) || a.tierIndex - b.tierIndex);
}

// The unit grid: one row per tag used in any lesson, grouped by tier, with
// one cell per lesson slot ("focus", "present" or "").
function pedagogyGrid(slots) {
  const ids = [...new Set(slots.flatMap((s) => (s.lesson ? Object.keys(s.lesson.pedagogyTags) : [])))];
  if (!ids.length) return null;
  const order = Object.keys(LENSES);
  const groups = TIERS.map((t) => ({
    ...t,
    rows: ids
      .filter((id) => LENSES[id].tier === t.id)
      .sort((a, b) => order.indexOf(a) - order.indexOf(b))
      .map((id) => ({
        ...lensRow(id, ""),
        cells: slots.map((s) => {
          const t = s.lesson && s.lesson.pedagogyTags[id];
          return t ? { level: t.level, how: t.how.join(" ") } : null;
        }),
      })),
  })).filter((g) => g.rows.length);
  return {
    columns: slots.map((s) => ({ number: s.number, title: s.title, url: s.lesson ? s.lesson.url : null })),
    groups,
    count: ids.length,
    routines: Object.keys(LENSES).filter((id) => LENSES[id].routine).map((id) => lensRow(id, "")),
  };
}

function loadTerms() {
  const dir = path.join(CONTENT, "terms");
  return listDir(dir)
    .filter((f) => /^\d{4}-t[1-4]\.md$/.test(f))
    .map((f) => {
      const [, year, term] = f.match(/^(\d{4})-t([1-4])/).map(Number);
      const { content } = readMatter(path.join(dir, f));
      return { year, term, key: year * 10 + term, label: termLabel(year, term), notesHtml: renderMd(content) };
    })
    .sort((a, b) => a.key - b.key);
}

// reflections.md: "## 2026-11-03 · Lesson 3 · 1/2A" headings, note below.
function loadReflections(file) {
  if (!fs.existsSync(file)) return [];
  const entries = [];
  // HTML comments hold instructions and example headings, so drop them first.
  const text = fs.readFileSync(file, "utf8").replace(/<!--[\s\S]*?-->/g, "");
  const parts = text.split(/^## /m).slice(1);
  for (const part of parts) {
    const newline = part.indexOf("\n");
    const heading = (newline === -1 ? part : part.slice(0, newline)).trim();
    const body = newline === -1 ? "" : part.slice(newline + 1);
    const bits = heading.split("·").map((s) => s.trim());
    const date = bits[0];
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      warn(file, `reflection heading "${heading}" should start with a date like 2026-11-03`);
      continue;
    }
    const lessonMatch = (bits[1] || "").match(/^Lesson\s+(\d+)$/i);
    entries.push({
      date,
      dateLabel: formatDate(date),
      lesson: lessonMatch ? Number(lessonMatch[1]) : null,
      className: bits[2] || "",
      html: renderMd(body),
    });
  }
  return entries.sort((a, b) => b.date.localeCompare(a.date));
}

function loadLesson(file, unit) {
  const { data, content } = readMatter(file);
  const base = path.basename(file, ".md");
  const number = Number(data.number ?? base.match(/^(\d+)/)?.[1]);
  if (!number) warn(file, "lesson has no number");
  const vtlm = asList(data.vtlm);
  const citw = asList(data.citw);
  checkValues(file, "vtlm", vtlm, VTLM);
  checkValues(file, "citw", citw, CITW);
  const pedagogyTags = loadPedagogy(file, data.pedagogy);
  const pdfFile = path.join(path.dirname(file), `${base}.pdf`);
  // CRT plans are made from the lesson page and saved as crt/NN-crt.pdf.
  const crtName = `${String(number).padStart(2, "0")}-crt.pdf`;
  const crtFile = path.join(path.dirname(file), "..", "crt", crtName);
  const live = asList(data.live).map((item) => ({
    kind: item.kind || "LINK",
    title: item.title || "[Untitled]",
    note: item.note || "",
    href: item.url || (item.file ? `${unit.url}live/${item.file}` : null),
    external: Boolean(item.url),
  }));
  return {
    number,
    slug: base,
    url: `${unit.url}lessons/${base}/`,
    title: data.title || `[Lesson ${number}]`,
    summary: data.summary || "",
    status: data.status === "draft" ? "draft" : "planned",
    duration: data.duration || DEFAULT_DURATION,
    lisc: liscFrom(data.lisc),
    curriculum: asList(data.curriculum),
    vtlm,
    citw,
    pedagogyTags,
    pedagogy: pedagogyRows(pedagogyTags),
    sequence: asList(data.sequence),
    // A resource is text, or { text, file } / { text, url } to link it.
    resources: asList(data.resources).map((r) => typeof r === "string"
      ? { text: r, href: null }
      : { text: r.text || "", href: r.url || (r.file ? `${unit.url}live/${r.file}` : null) }),
    live,
    crtNotes: data.crt_notes || "",
    pdf: fs.existsSync(pdfFile) ? `${unit.url}lessons/${base}.pdf` : null,
    crtPdf: fs.existsSync(crtFile) ? `${unit.url}crt/${crtName}` : null,
    ...splitSections(content),
    sourcePath: `content/units/${unit.slug}/lessons/${base}.md`,
  };
}

function loadUnit(slug, classes, progress) {
  const dir = path.join(CONTENT, "units", slug);
  const file = path.join(dir, "unit.md");
  if (!fs.existsSync(file)) {
    warn(dir, "folder has no unit.md, skipped");
    return null;
  }
  const { data, content } = readMatter(file);
  const cohort = COHORTS.find((c) => c.id === data.cohort);
  if (!cohort) warn(file, `unknown cohort "${data.cohort}" (use f, y12, y34 or y56)`);
  const year = Number(data.year);
  const term = Number(data.term);

  const unit = {
    slug,
    url: `/units/${slug}/`,
    title: data.title || "[Unit title]",
    cohort: data.cohort,
    cohortLabel: cohort ? cohort.label : String(data.cohort),
    year,
    term,
    termKey: year * 10 + term,
    termLabel: termLabel(year, term),
    lessonCount: Number(data.lesson_count) || DEFAULT_LESSON_COUNT,
    focus: data.focus || "",
    blurb: data.blurb || "",
    descriptionHtml: renderMd(content),
    lisc: liscFrom(data.lisc),
    curriculum: asList(data.curriculum),
    claudeChat: data.claude_chat || "",
    links: asList(data.links),
    nextTaught: data.next_taught || termLabel(year + 2, term),
    reflectionsEditUrl: `https://github.com/${REPO}/edit/${BRANCH}/content/units/${slug}/reflections.md`,
    classes: (classes[String(year)] || {})[data.cohort] || [],
  };
  // progress.json: { unit slug: { lesson number: { class: "YYYY-MM-DD" } } }
  const done = (n, c) => ((progress[slug] || {})[n] || {})[c] || "";

  const lessonDir = path.join(dir, "lessons");
  const lessons = listDir(lessonDir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => loadLesson(path.join(lessonDir, f), unit))
    .sort((a, b) => a.number - b.number);

  const reflections = loadReflections(path.join(dir, "reflections.md"));
  const outline = asList(data.outline);

  // One slot per lesson number. A lesson file wins over an outline entry.
  const highest = Math.max(unit.lessonCount, ...lessons.map((l) => l.number));
  if (highest > unit.lessonCount) warn(file, `a lesson is numbered above lesson_count (${unit.lessonCount})`);
  const slots = [];
  for (let n = 1; n <= highest; n++) {
    const lesson = lessons.find((l) => l.number === n) || null;
    const planned = Boolean(lesson && lesson.status === "planned");
    const sketch = outline.find((o) => Number(o.number) === n) || {};
    slots.push({
      number: n,
      lesson,
      planned,
      title: lesson ? lesson.title : sketch.title || `[Lesson ${n}]`,
      summary: lesson ? lesson.summary : sketch.summary || "",
      notes: reflections.filter((r) => r.lesson === n).length,
    });
  }
  const next = slots.find((s) => !s.planned) || null;
  for (const s of slots) {
    s.isNext = s === next;
    s.state = s.planned ? "planned" : s.lesson ? "draft" : s.isNext ? "next" : "later";
    s.stateLabel = { planned: "Planned", draft: "Draft", next: "Next to plan", later: "Not planned" }[s.state];
    s.extras = [
      s.lesson && s.lesson.pdf ? "Plan PDF" : "",
      s.lesson && s.lesson.live.length ? `${s.lesson.live.length} live` : "",
      s.notes ? `${s.notes} ${s.notes === 1 ? "note" : "notes"}` : "",
    ].filter(Boolean).join(" · ");
  }

  for (const lesson of lessons) {
    lesson.classes = unit.classes.map((c) => {
      const date = done(lesson.number, c);
      return { name: c, date, dateLabel: date ? formatShortDate(date) : "" };
    });
    lesson.reflections = reflections.filter((r) => r.lesson === lesson.number);
  }
  lessons.forEach((l, i) => {
    l.prev = lessons[i - 1] ? { url: lessons[i - 1].url, number: lessons[i - 1].number, title: lessons[i - 1].title } : null;
    l.next = lessons[i + 1] ? { url: lessons[i + 1].url, number: lessons[i + 1].number, title: lessons[i + 1].title } : null;
  });

  // Where each class is up to: the first lesson it has not finished.
  const classRows = unit.classes.map((c) => {
    const cells = slots.map((s) => {
      const date = done(s.number, c);
      return { number: s.number, title: s.title, enabled: Boolean(s.lesson), date, dateLabel: date ? formatShortDate(date) : "" };
    });
    const nextCell = cells.find((cell) => !cell.date);
    return {
      name: c,
      cells,
      next: nextCell ? `Lesson ${nextCell.number}: ${nextCell.title}` : "All done",
      // Short form for the home page's at-a-glance panel.
      glance: nextCell ? `L${nextCell.number} ${nextCell.title}` : "All done",
    };
  });

  return Object.assign(unit, {
    lessons,
    classRows,
    slots,
    pedagogy: pedagogyGrid(slots),
    plannedCount: slots.filter((s) => s.planned).length,
    nextToPlan: next ? { number: next.number, title: next.title } : null,
    pdfs: lessons.filter((l) => l.pdf).map((l) => ({ number: l.number, title: l.title, url: l.pdf })),
    reflections,
    unitReflections: reflections.filter((r) => r.lesson === null),
  });
}

export default function () {
  const terms = loadTerms();
  const classes = readJson(path.join(CONTENT, "classes.json"), {});
  const progress = readJson(path.join(CONTENT, "progress.json"), {});
  const units = listDir(path.join(CONTENT, "units"))
    .filter((f) => fs.statSync(path.join(CONTENT, "units", f)).isDirectory())
    .map((slug) => loadUnit(slug, classes, progress))
    .filter(Boolean)
    .sort((a, b) => b.termKey - a.termKey || COHORTS.findIndex((c) => c.id === a.cohort) - COHORTS.findIndex((c) => c.id === b.cohort));

  const latestKey = Math.max(0, ...terms.map((t) => t.key), ...units.map((u) => u.termKey));
  const currentTerm = terms.find((t) => t.key === latestKey) || {
    key: latestKey,
    year: Math.floor(latestKey / 10),
    term: latestKey % 10,
    label: termLabel(Math.floor(latestKey / 10), latestKey % 10),
    notesHtml: "",
  };
  const currentUnits = units.filter((u) => u.termKey === currentTerm.key);

  const overview = COHORTS.map((c) => ({
    ...c,
    unit: currentUnits.find((u) => u.cohort === c.id) || null,
  }));

  const latestReflections = currentUnits
    .flatMap((u) =>
      u.reflections.map((r) => {
        const lesson = u.lessons.find((l) => l.number === r.lesson);
        return {
          ...r,
          where: `${u.cohortLabel} · ${r.lesson ? `Lesson ${r.lesson}${lesson ? ` ${lesson.title}` : ""}` : "Unit"}`,
          url: lesson ? lesson.url : u.url,
        };
      })
    )
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5);

  const byTerm = [];
  for (const u of units) {
    let group = byTerm.find((g) => g.key === u.termKey);
    if (!group) byTerm.push((group = { key: u.termKey, label: u.termLabel, units: [] }));
    group.units.push(u);
  }

  return {
    repo: REPO,
    branch: BRANCH,
    currentTerm,
    dashboards: currentUnits.filter((u) => u.classes.length),
    overview,
    latestReflections,
    units,
    unitsByTerm: byTerm,
    lessons: units.flatMap((u) => u.lessons.map((l) => ({ ...l, unit: u }))),
  };
}
