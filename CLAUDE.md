# FCPS STEAM Hub

A personal planning hub for James Jardine, STEAM Leader at Footscray City Primary School (Melbourne). James teaches STEAM to every class from Foundation to Year 6, one 45-minute lesson per class per week. Only James uses the site. There are no logins and no other users.

The original brief and the five design mockups are in `steam-hub-handover/`. The mockup markup and inline styles are the visual reference (ignore `support.js`, `<x-dc>`, `<sc-for>` and the `DCLogic` scripts, which belong to the design tool).

## What the hub does

1. **Overview** (`/`): one card per cohort for the current term: unit title, focus, blurb, lessons planned as dots, "Up next", Open unit. Below: latest reflections and "Also this term".
2. **Unit and lesson pages** for James: LISC, curriculum codes, lesson list, resources, reflections, CRT notes.
3. **Live mode** (Phase 3): student-facing projector pages per lesson (1280×720): big LI and SC, hook, steps, artefacts. No teacher notes.
4. **Archive** (Phase 2): past units with search and year-level filters. James teaches on a two-year cycle, so every unit comes back two years later.

## Hard rules

- **Privacy.** The site is public. Never include student names, student work with names on it, assessment data or anything that identifies a student. Reflections are about classes and lessons. Naming a class (for example "1/2A") is fine; naming a student is not. Every page carries `noindex` and there is a `robots.txt`, but treat everything as public anyway.
- **No em dashes** anywhere: copy, content, code comments, commit messages. No en dashes as punctuation and no spaced hyphen used as a dash. Ranges use "to" ("Lessons 1 to 4", "Foundation to Year 6").
- **Do not invent lesson content.** When something is unknown, leave a clearly marked placeholder in square brackets, for example `[Full plan to add from the Lesson 2 PDF]`. Text that starts with `[` is styled as a placeholder on the site.
- **No class progress tracker** and nothing that needs routine manual data entry. Status is worked out from the files.
- **No logins, databases, servers.** Content lives as files in the repo.
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
- **"Make a CRT version"** copies a short CRT request for that lesson to the clipboard and opens the unit's pinned chat. Full CRT versions are generated on request, never stored for every lesson.
- **Current term** is the newest file in `content/terms/`.
- **Go live and Archive** are hidden from the navigation until Phases 3 and 2.

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
```

Cohort ids: `f` (Foundation), `y12` (Year 1/2), `y34` (Year 3/4), `y56` (Year 5/6).

Live artefacts are standalone 1280×720 projector pages in the house style: `NN-slides.html` (the lesson deck), `NN-frayer.html` (Frayer word wall) and an animated how-to (for example `03-weaving.html`). Each page supports `?embed`, which hides its top bar so the deck can show it in a slide. When adding a lesson, copy the previous lesson's pages and change the content.

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
claude_chat: https://claude.ai/chat/...   # pinned chat for this cohort and term
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
vtlm: [Focus the learning, Scaffold practice]
citw: [CICs, Worked examples]
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

Tokens are CSS custom properties at the top of `src/assets/site.css`:

- Indigo `#3F51B5` (primary), deep indigo `#1A237E` (headings), `#283593` (chip text), pale indigo `#E8EAF6`
- Amber highlight `#FFF8E1` with text `#6D4C00`; accent `#F9A825`
- Page background `#F6F7FB`; cards white, `1px solid #E0E0E0`, radius 12px
- Body text `#333333`, Helvetica/Arial
- Must work on a phone and on a classroom projector. Touch targets at least 44px.

## Layout of the repo

```
CLAUDE.md
eleventy.config.js        # Eleventy setup, path prefix, copies unit files
src/_data/site.js         # loads content/, computes everything
src/_includes/            # base layout and macros
src/index.njk             # Overview
src/units.njk             # all units
src/unit.njk              # one page per unit
src/lesson.njk            # one page per lesson
src/assets/               # site.css, site.js
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
