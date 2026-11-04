# FCPS STEAM Hub

A personal planning hub for James Jardine, STEAM Leader at Footscray City Primary School (Melbourne). James teaches STEAM to every class from Foundation to Year 6, one 45-minute lesson per class per week. Only James uses the site. There are no logins and no other users.

The original brief and the five design mockups are in `steam-hub-handover/`. The mockup markup and inline styles are the visual reference (ignore `support.js`, `<x-dc>`, `<sc-for>` and the `DCLogic` scripts, which belong to the design tool).

## What the hub does

1. **Overview** (`/`): one card per cohort for the current term: unit title, focus, blurb, lessons planned as dots, "Up next", Open unit. Below: latest reflections and "Also this term".
2. **Unit and lesson pages** for James: LISC, curriculum codes, lesson list, resources, reflections, CRT notes.
3. **Live mode** (Phase 3): student-facing projector pages per lesson (1280×720): big LI and SC, hook, steps, artefacts. No teacher notes.
4. **Archive** (Phase 2): past units with search and year-level filters. James teaches on a two-year cycle, so every unit comes back two years later.

## Hard rules

- **VTLM 2.0 first.** Every new or edited item (slides, artefacts, lesson and CRT plans, pages) follows the Victorian Teaching and Learning Model 2.0, above all the Element of Learning "Attention and Focus": minimise distractions and remove anything on the page that is not the core focus. On student-facing pages: one idea per slide, the fewest words that do the job, no decoration, no answers shown under the question, and controls hidden while presenting. James asked for this in November 2026.
- **Privacy.** The site is public. Never include student names, student work with names on it, assessment data or anything that identifies a student. Reflections are about classes and lessons. Naming a class (for example "1/2A") is fine; naming a student is not. Every page carries `noindex` and there is a `robots.txt`, but treat everything as public anyway.
- **No em dashes** anywhere: copy, content, code comments, commit messages. No en dashes as punctuation and no spaced hyphen used as a dash. Ranges use "to" ("Lessons 1 to 4", "Foundation to Year 6").
- **Do not invent lesson content.** When something is unknown, leave a clearly marked placeholder in square brackets, for example `[Full plan to add from the Lesson 2 PDF]`. Text that starts with `[` is styled as a placeholder on the site.
- **Class ticks are the only manual entry.** James asked (November 2026) to tick which class has finished each lesson. Keep it to that: one tap per class per lesson. Lesson status is still worked out from the files.
- **No logins, databases, servers.** Content lives as files in the repo. Saving from the site goes through the GitHub API with a key James keeps in each browser (never in the repo).
- Ask James before big structural decisions.

## Decisions (agreed November 2026)

- **Generator:** Eleventy 3 with Nunjucks templates. Dependencies are only `@11ty/eleventy`, `gray-matter` and `markdown-it`. All content is loaded and all derived values are computed in one place, `src/_data/site.js`; templates only render.
- **Hosting:** repo `jamesjardine2/steam-hub`, site at `https://jamesjardine2.github.io/steam-hub/`. Eleventy `pathPrefix` is `/steam-hub/` and the HTML base plugin rewrites root-relative links, so templates write links as `/units/...`.
- **Deploy:** GitHub Actions (`.github/workflows/deploy.yml`) builds and publishes on every push to `main`. James mostly adds and edits files through the GitHub website, so nothing should need to run on his Mac.
- **Lesson length is a field.** Each unit has `lesson_count`, default 8 (10-week terms lose about 2 lessons to school events). Term 4 2026 units are 7. Never hard-code a lesson count: dots, "X of N" and headers all come from `lesson_count`.
- **Plan PDFs go in the repo,** next to the lesson file with the same name (`03-weave-it.md` and `03-weave-it.pdf`). They are public, so they must contain no student details.
- **Full plan text goes in the lesson body** so the archive can search it later. The PDF is optional.
- **"Up next" means next to plan:** the lowest lesson number without a planned lesson file.
- **Reflections live in a separate `reflections.md` per unit,** so a pinned chat can regenerate a lesson file without wiping notes. The "Add a reflection" button opens GitHub's web editor on that file (a static site cannot save a textarea).
- **"Next lesson in Claude"** opens the unit's pinned chat (`claude_chat`).
- **"Make a CRT plan with Claude"** on a lesson page starts the `crt-plan` workflow: Claude Code follows `.github/crt-plan.md`, writes `content/units/<unit>/crt/NN-crt.html` (no screens, everyday resources, every step scripted, same LISC), Chrome prints it to `NN-crt.pdf`, and the lesson page offers the PDF to download. James can add notes and make a new one at any time. CRT plans are made on request, never for every lesson. `crt/04-crt.html` in Paper Makers is the layout to copy.
- **Current term** is the newest file in `content/terms/` (units planned ahead for a later term do not move the Overview on). Add the term file when a new term starts.
- **Curriculum codes link to the VCAA site** (`lib/vc2.js`): chips and any code in lesson text open the code on f10.vcaa.vic.edu.au (the learning area's curriculum page with `#CODE` for every learning area, or the VCAA search for languages and capabilities). Write codes in full (VC2TDE2C04) so they link.
- **Curriculum data** (`src/_data/curriculum.json`, November 2026): every Science, Design and Technologies and Digital Technologies code from Foundation to Level 6, with its strand, sub-strand and a short summary in our own words (the VCAA owns the official wording and the site is public, so it stays on the VCAA site). Code chips show the summary on hover. The build warns about any Science or Technologies code up to Level 6 in a unit or lesson that is not in the file.
- **Connections** (`connections:` on a unit or lesson): codes from other learning areas the work links to (Health, Music, Maths, English, ...). They show as dashed chips labelled with the learning area, under the curriculum codes.
- **Resources** (`src/_data/resources.json`): what the STEAM room owns (`owned: true`, with counts, year bands, learning areas and what each needs) and ideas to buy (`owned: false`). Items with `confirm: true` have a count James still needs to check. Planning (see `PLANNING.md`) builds on owned items only.
- **Go live and Archive** are hidden from the navigation until Phases 3 and 2.

## Saving from the site (added November 2026)

`src/assets/hub.js` talks to the GitHub API using a fine-grained token stored in the browser's localStorage (key `steamhub.githubToken`), set on `/settings/`. The token needs Contents and Actions read and write on steam-hub only. Never ask for, store or handle the token yourself.

- **Class ticks.** `content/classes.json` lists classes by year and cohort (2026 Year 1/2: 1A, 1B, 1C, 2A, 2B, 2C; 2027 will have four Year 1 classes). Ticks are saved to `content/progress.json` as `{ unit slug: { lesson number: { class: "YYYY-MM-DD" } } }`, one commit per tick. They appear on each lesson page ("Classes finished"), on the unit page and on the home page ("Where each class is up to"). The "Up to" column is the first lesson a class has not finished. The file is also published at `/progress.json` so the site can show fresh ticks without a key.
- **Plan with Claude.** The unit page's "Plan Lesson N with Claude" button (and "Send to Claude" on a draft) starts `.github/workflows/plan-lesson.yml`. It runs Claude Code headless with the `CLAUDE_CODE_OAUTH_TOKEN` repo secret (James's Claude subscription, made with `claude setup-token`), following `.github/plan-lesson.md`. Claude writes the lesson as `status: draft` plus its three artefacts, the workflow checks the build and dashes, commits, and starts the deploy. Keep `.github/plan-lesson.md` in step with this file.
- **Approve.** A draft lesson page shows "Approve this lesson", which changes `status: draft` to `status: planned` in the lesson file.
- **Planning** (`/planning/`, November 2026; spec in `PLANNING.md`). Backward design: a survey of non-negotiables (curriculum targets from `curriculum.json`, report subject, must-use and don't-use resources from `resources.json`, checking understanding, dates, links to class learning, notes, and an optional "spark"), then Claude suggests three directions, James picks and mixes part by part, and Claude writes a draft unit. Each question is labelled from "Gut and Evidence in Teaching": Evidence leads (cyan), Your call (orange), Both (violet) or Fixed. A plan is `content/plans/<year>-t<term>-<cohort>.json`; `src/assets/planning.js` saves it through the GitHub API (it reuses hub.js through `window.steamHub`) and starts `.github/workflows/plan-unit.yml`, which runs Claude Code following `.github/plan-unit.md` in rounds `directions`, `draft` and `revise`, then checks the result with `scripts/check-plan.mjs`. A unit written this way has `status: draft` and `plan: <id>`; its unit page shows "Approve this unit" and "Send to Claude", and it stays off the Overview until approved. Keep `.github/plan-unit.md` in step with this file.

## Lesson pages

A lesson can simply point to an outside plan (the Year 3/4 LEGO Education lessons do): a file with a title, summary, `status: planned`, resources and a `LINK` in `live`, and a one-line body. With no LISC, sequence or sections, the page leaves out those accordions. The lesson body is split on `## ` headings into accordion sections ("Lesson overview"). The order is LISC, Pedagogy and sources (when the lesson has tags, with its curriculum codes at the bottom), Lesson at a glance, the body sections, Resources, then Reflections. Text before the first heading shows as a note above the accordions, and a `## The key idea` section is added to that note. Some sections stay in the file (so the archive can search them) but are not shown: `## Notes for the CRT` (the CRT gets the CRT plan PDF) always, and `## Curriculum links` once the lesson has pedagogy tags, which also replace the Curriculum and approach accordion. Keep lesson bodies in `## ` sections so this works. (James, November 2026: fewer accordions, pedagogy near the top.)

## Content model

```
content/
  terms/
    2026-t4.md                    # body: "Also this term" notes (Markdown list)
  units/
    2026-t4-y12-paper-makers/     # {year}-t{term}-{cohort}-{short-name}
      unit.md
      reflections.md
      lessons/
        01-paper-power.md         # {two-digit number}-{short-name}.md
        01-paper-power.pdf        # optional plan PDF, same base name
      live/                       # artefacts used in lessons, prefixed with the lesson number (04-slides.html)
      crt/                        # CRT plans made from the lesson page (04-crt.html and 04-crt.pdf)
  plans/
    2027-t1-y12.json              # a plan in progress from the Planning page
```

Cohort ids: `f` (Foundation), `y12` (Year 1/2), `y34` (Year 3/4), `y56` (Year 5/6).

Live artefacts are standalone 1280×720 projector pages in the house style: `NN-slides.html` (the lesson deck), `NN-frayer.html` (Frayer word wall: three words that carry the lesson's concept and that students don't already own, never everyday words like "mix" or "sticky"; James, November 2026) and an animated how-to (for example `03-weaving.html`). Each page supports `?embed`, which hides its top bar so the deck can show it in a slide. When adding a lesson, copy the previous lesson's pages and change the content.

Artefacts are student-facing, so they are colourful: a dark Electric stage with every accent used for meaning, the same in every lesson. Their styles are shared in `src/assets/live.css` (linked as `../../../assets/live.css` after `tokens.css`); pages have no `<style>` block and no colour codes. The stage div carries a family class (`deck`, `frayer` or `howto`). Slide role classes set the colour: `hook` orange, `safety` pink, `recall` blue, `record` cyan, none for violet (title, Learning Intention). Frayer quadrants are always violet (meaning), orange (what it is like), cyan (examples) and pink (non-examples). Drawings use theme roles for neutrals (`fill="var(--paper)"`, `var(--ink)`, `var(--panel)`, `var(--text-violet)` for outlines) and accents for colour fills, so they work in both modes; scripts use `T("token")` for a hex value. A unit can keep a shared picture library in `live/pictures.js` (Teddy's New House does) or `live/kit.js` (micro:bit Game Design: pictures plus `blockStack()`, which draws MakeCode-style blocks coloured by drawer for code slides and how-tos): pictures drawn once with theme tokens and used by every artefact in the unit, so the same object always looks the same. For Foundation and Year 1/2, lean on pictures over words. Each artefact loads `theme.js` with `data-area="live"` and `live.js`, and has the mode switch in its top bar. The top and bottom bars float over the content and stay hidden while presenting: a bar shows while the mouse is over its edge, a first tap shows it on a touch screen, and arrow keys change slides. Embedded pages put their own controls on the top edge, since the deck uses the bottom. Inside the deck, arrows and Back and Next go through an embedded page's steps first (each Right on a word wall uncovers the next box, then moves to the next word) and only then to the next slide; going back into a slide lands on its last step, and small dots show for a moment after each step. A page joins in by setting `window.liveSteps` (`{ kind: "steps", count: STEPS.length, at: () => current, go }` for a how-to, `{ kind: "words", count: WORDS.length, at: () => current, show }` for a word wall), which comes along when a page is copied.

Every non-Markdown file under `content/units/` is copied to the site at the same path under `/units/`, so `content/units/<slug>/live/steps.html` is served at `/units/<slug>/live/steps.html`.

### unit.md

```yaml
title: "Stronger Together: Paper Makers"
cohort: y12
year: 2026
term: 4
lesson_count: 7            # default 8
focus: "D&T + Chemical Science"
blurb: One or two sentences for the Overview card.
lisc:
  intention: To ...
  criteria:
    - ...
curriculum: [VC2S2U05, VC2TDE2C04]
connections: [VC2HP2P01]   # optional: codes from other learning areas
claude_chat: https://claude.ai/chat/...   # pinned chat for this cohort and term
status: planned            # optional: draft for a unit written from the Planning page
plan: 2027-t1-y12          # optional: the plan it came from
report_subject: Digital Technologies   # optional: the reporting subject it feeds
assessment:                # optional: the assessment plan, shown on the unit page
  - title: Book Creator page
    how: One page per pair showing the design and test.
    when: Lesson 7
links:                     # optional extra files and links
  - label: ...
    url: ...
outline:                   # optional: lessons not written yet
  - number: 5
    title: ...             # optional
    summary: ...
next_taught: "Term 4, 2028"  # optional; default is the same term two years later
```

The body (Markdown) is the short description in the unit page header.

### Lesson files

```yaml
number: 3
title: Weave It
summary: One line for the unit's lesson list.
status: planned            # planned (default) or draft
duration: 45               # minutes, default 45
lisc:
  intention: To ...
  criteria:
    - ...
curriculum: [VC2S2U05]
connections: [VC2AMU2E01]  # optional: codes from other learning areas
vtlm: [Focus the learning, Scaffold practice]
citw: [CICs, Worked examples]
pedagogy:                  # optional: tag ids from src/_data/lenses.json
  citw.interest_cues:
    level: focus           # focus or present
    how: "The storm animation opens the lesson and asks which material would keep Teddy dry."
sequence:                  # "Lesson at a glance"
  - phase: Hook
    time: 5 min
    what: ...
resources:
  - ...
live:                      # "Bring up live"
  - kind: SLIDE            # SLIDE, HTML, IMG, VIDEO, LINK
    title: ...
    note: ...
    file: steps.html       # in the unit's live/ folder, or use url: for external artefacts
crt_notes: What would change for a CRT, same Learning Intention.
```

The body is the full lesson plan in Markdown.

Allowed `vtlm` values: Focus the learning; Explicit explanation and modelling; Scaffold practice; Monitor progress.
Allowed `citw` values: CICs; Vocabulary; Frayer model; Strategy instruction and modelling; Worked examples.

`pedagogy` tags (added November 2026, see `HANDOVER.md` in `steam-hub-handover/pedagogy/`): every key must be a node id in `src/_data/lenses.json`, with a `level` of `focus` (what the lesson deliberately targets, usually 1 to 3) or `present` (it happens but is not the target), and `how`: at least one statement (a string, or a list) saying how this lesson uses that practice, taken from the plan itself, not a definition of the practice. James asked (November 2026) that every tag carries one. The build warns about unknown ids, wrong levels and missing statements; a tag without a statement shows "[How this lesson uses it: to add]". The statement shows under the tag on the lesson page and as the dot's tooltip on the unit grid. Routine nodes (`"routine": true`, such as the values acknowledgement) are not tagged; the unit page lists them once as "Built into every lesson". The lesson page shows the tags in a "Pedagogy and sources" accordion (icon, label, level, path, source link) and the unit page shows "Pedagogy at a glance", a grid of tags by lesson. A tag without its own link uses the nearest parent's; with none up the chain it shows an amber "add link". Once a lesson has tags they replace its VTLM and CITW chips. Teacher pages only: never on artefacts or CRT plans. Tier colours are `--tier-*` in `tokens.css`; icons are the Tabler outline webfont, loaded only on pages with tags. `npm run check-links` (`scripts/check-links.mjs`, once a term) checks every source link that needs no login, lists unverified nodes, and with `-- --write` updates the `checked` dates.
The build prints a warning for anything else.

### LISC format

Always rendered, and copied, exactly like this:

```
Learning Intention:
To ...

Success Criteria:
I can:
- ...
- ...
- ...
```

### reflections.md

Each entry is a level-2 heading, then the note:

```
## 2026-11-03 · Lesson 3 · 1/2A
Slits were too close together, cut them wider next time.

## 2026-12-12 · Unit
Keep the weaving lessons, cut Lesson 4 short.
```

Heading parts, separated by `·`: ISO date, then `Lesson N` or `Unit`, then an optional class. Text before the first heading is ignored (use it for instructions).

### Derived values (computed in `src/_data/site.js`)

- A lesson is **planned** when its file exists and `status` is not `draft`.
- **Next to plan** is the lowest number from 1 to `lesson_count` that is not planned.
- **Dots:** planned is indigo, next to plan is amber, the rest are grey.
- **Next taught** is the same term two years later unless `next_taught` is set.
- **Latest reflections** on the Overview are the newest entries from the current term's units.

## Adding content

- `templates/lesson.md` and `templates/unit.md` are blank starting files.
- `templates/README.md` is the spec to paste into a pinned Claude chat so it outputs a ready-to-commit lesson file. Keep it in step with this file whenever the content model changes.

## Visual style

The "Electric" design system in `DESIGN.md` (November 2026): dark theme on `--void` #0C0C0F, electric violet `--violet` #5329E7 as the primary, Plus Jakarta Sans for everything.

- All colour, font and radius tokens live in one shared stylesheet, `src/assets/tokens.css`, loaded before `src/assets/site.css`. Never hard-code a colour or font anywhere else, and don't add colours that are not in `DESIGN.md`.
- **Light and dark mode.** `tokens.css` has the fixed palette plus theme roles (`--bg`, `--card`, `--hover`, `--border`, `--text`, `--text-muted`, `--text-violet`, `--text-orange`, ..., and for drawings `--paper`, `--ink`, `--panel`, `--panel-2`). Dark is the default; `[data-theme="light"]` maps the same palette the other way, so no new colours. Stylesheets use the roles for surfaces and text, and the palette only for accent fills and text on those fills. `src/assets/theme.js` sets the mode from a per-device choice: the hub (switch in the top bar) starts dark, live artefacts (switch in their top bar) start light, and the two are remembered separately. CRT plans ignore it and always print light.
- `--violet` is a fill only, always with white text. Violet text on dark uses `--ultraviolet`. Dark text goes on `--solar-orange`, `--plasma-pink` and `--ion-cyan`.
- One partner accent per view. The hub uses `--solar-orange` for "next to plan", drafts, CRT and notes. Live artefacts are the exception: they are for students and use all the accents, each with a fixed meaning (see Content model).
- Printed student handouts and stick-ins (for example `live/challenge-card.html` in the Year 3/4 unit) use `src/assets/handout.css` after `tokens.css`: light, outlines rather than fills, two A5 cards on A4 landscape. Print them to a PDF next to the HTML from the built site, like CRT plans.
- CRT plans print on white paper: `src/assets/crt.css` keeps them light, with violet headers and orange notes. They are printed from the built site (`_site/units/<unit>/crt/`) so the shared stylesheets load. Never give them a dark theme.
- Flat: no gradients, glows or shadows. Cards radius 16px, buttons and pills fully rounded, inputs 10px.
- Must work on a phone and on a classroom projector. Anything students read stays in `--glow`, not `--mist`. Touch targets at least 44px.

## Layout of the repo

```
CLAUDE.md
eleventy.config.js        # Eleventy setup, path prefix, copies unit files
lib/vc2.js                # links Victorian Curriculum 2.0 codes to the VCAA site
src/_data/site.js         # loads content/, computes everything
src/_data/lenses.json     # pedagogy tag vocabulary
src/_data/curriculum.json # Science and Technologies codes F to 6, with summaries
src/_data/resources.json  # STEAM room inventory and ideas to buy
scripts/check-links.mjs   # checks the pedagogy source links (npm run check-links)
src/_includes/            # base layout and macros
src/index.njk             # Overview
src/units.njk             # all units
src/unit.njk              # one page per unit
src/lesson.njk            # one page per lesson
src/settings.njk          # connect a device (GitHub key) and Claude setup steps
src/planning.njk          # Planning page (script: src/assets/planning.js)
.github/workflows/plan-unit.yml    # Claude Code plans a unit (directions, draft, revise)
.github/plan-unit.md      # the instructions Claude follows in that workflow
scripts/check-plan.mjs    # checks a plan after each round
src/assets/hub.js         # ticks, approve and plan buttons (GitHub API)
.github/workflows/plan-lesson.yml  # Claude Code plans a lesson as a draft
.github/plan-lesson.md    # the instructions Claude follows in that workflow
src/assets/               # tokens.css (design tokens), theme.js (light/dark), site.css, live.css (artefacts), crt.css (CRT print), site.js
content/                  # all teaching content
templates/                # lesson and unit templates, spec for Claude chats
steam-hub-handover/       # original brief and mockups (not built)
```

## Commands

```bash
npm install          # once
npm start            # local preview at http://localhost:8080/steam-hub/
npm run build        # build into _site/
```

## Phases

1. **Phase 1 (current):** content model, site skeleton, Overview, Unit and Lesson pages, GitHub Pages deploy, seeded with Term 4 2026. Started with Year 1/2 Stronger Together: Paper Makers. Still to add: Foundation Teddy's New House, Year 3/4 LEGO Science and Paper Bridges, Year 5/6 micro:bit Game Design with Jacdac (seed details are in the brief).
2. **Phase 2:** Archive with search and filters; import 2026 Terms 1 to 3.
3. **Phase 3:** Live mode and student-facing pages per lesson.
4. **Phase 4 (maybe):** class-level assessment summaries, no student names.
