# FCPS STEAM Hub: project brief

## What this is

A personal web hub for James Jardine, STEAM Leader at Footscray City Primary School (Melbourne). James teaches STEAM to every class from Foundation to Year 6, one 45-minute lesson per class per week. The hub has four jobs:

1. **Overview**: what each year level is doing in STEAM this term.
2. **Unit and lesson pages** for James: plans, LISC, curriculum codes, resources, reflections.
3. **Live mode**: student-facing pages James puts on the projector during a lesson (Learning Intention, hook, steps, interactive artefacts).
4. **Archive**: James teaches on a two-year cycle, so every unit comes back two years later. The archive is where he finds what he did, what worked and what to change.

Only James uses it. There are no logins and no other users.

## Hosting and privacy

- Static site on **GitHub Pages**, built from a GitHub repo (James already hosts sites at jamesjardine2.github.io).
- The site is **public**, so it must never contain student names, student work with names on it, assessment data or anything identifying a student. Reflections are written about classes and lessons, never about individual students.
- No backend and no database. Content lives as files in the repo.

## How James works (important context)

- Each term, each cohort (Foundation, Year 1/2, Year 3/4, Year 5/6) does one integrated STEAM unit of about 7 lessons. Units weave together Science, Digital Technologies and Design and Technologies, all from the Victorian Curriculum 2.0 (codes look like VC2S2U05, VC2TDE2C04, VC2TDI6P02).
- He plans lessons one at a time in a pinned Claude chat per cohort (e.g. "1/2 Term 4"), typing "Next lesson". Each lesson becomes a PDF plan. **The hub must make it easy for those lessons to be added as files**, ideally by Claude producing a lesson file in the hub's format.
- **LISC format** (always exactly like this):

  ```
  Learning Intention:
  To ...

  Success Criteria:
  I can:
  - ...
  - ...
  - ...
  ```

- His school's teaching model is VTLM 2.0 Explicit Teaching (Focus the learning; Explicit explanation and modelling; Scaffold practice; Monitor progress) plus CITW strategies (cognitive interest cues, called CICs; vocabulary such as the Frayer model; strategy instruction and modelling; worked examples). Lessons should be able to note which of these they use.
- Lessons are usually resource-rich. Occasionally a CRT (relief teacher) takes a lesson, so each lesson can carry a short **CRT notes** field (what would change for a CRT, same Learning Intention). Full CRT versions are generated on request, not stored for every lesson.
- He does **not** want a class progress tracker or anything that needs manual data entry.

## Design

A mockup of five screens is in `mockup/` (`.dc.html` files from Claude's design canvas: the markup and inline styles are the reference; ignore `support.js`, `<x-dc>`, `<sc-for>` and the `DCLogic` script wrappers, which belong to the design tool). Screens:

| File | Screen | Notes |
|---|---|---|
| `Main.dc.html` | Overview | Card per year level: unit title, focus, blurb, lessons planned (7 dots), "Up next", Open unit / Go live. Below: latest reflections, "Also this term". |
| `Unit.dc.html` | Unit page | Indigo header with unit title; lesson list with status chips; sidebar with unit LISC, curriculum chips, files and links, unit reflection and "Next taught: Term X, YYYY". |
| `Lesson.dc.html` | Lesson page (teacher) | LISC, lesson-at-a-glance table (phase, time, what), reflections; sidebar with "Bring up live" artefacts, resources, "Away for this one?" CRT box. |
| `Live.dc.html` | Live mode (projector, 16:9) | Big LI and SC, hook, steps; tab buttons along the bottom; no teacher notes shown. |
| `Archive.dc.html` | Archive | Search box, year-level filter pills, unit cards with "Next taught". |

Visual tokens (James's house style):

- Indigo `#3F51B5` (primary), deep indigo `#1A237E` (headings), `#283593` (chip text), pale indigo `#E8EAF6`
- Amber highlight `#FFF8E1` with text `#6D4C00`; accent `#F9A825`
- Page background `#F6F7FB`, cards white with `1px solid #E0E0E0`, radius 12px
- Body text `#333333`, Helvetica/Arial
- Pages must work on a phone and on a classroom projector; live mode is designed for 1280×720
- No em dashes in any copy

## Content model (to agree first)

Suggested starting point; refine it before building pages:

```
content/
  units/
    2026-t4-y12-paper-makers/
      unit.md            # frontmatter: title, cohort, year, term, focus, blurb, curriculum[], lisc, next_taught, status
      lessons/
        01-paper-power.md    # frontmatter: number, title, status, lisc, curriculum[], vtlm[], citw[], resources[], live[], crt_notes; body: sequence + plan
        02-twist-it.md
      reflections.md     # dated notes, unit-level and per lesson
      live/              # standalone HTML artefacts, slides, images used in the lesson
```

Principles:

- Markdown with YAML frontmatter, so files are readable and editable by hand and easy for Claude to write.
- One folder per unit so the archive is just past units.
- Cohort ids: `f`, `y12`, `y34`, `y56`.
- `next_taught` is computed (term + 2 years) unless overridden.
- Existing external artefacts (e.g. jamesjardine2.github.io/adaptationsart) can be linked rather than copied.
- Provide a **lesson template file** plus a short written spec, so a Claude chat can output a ready-to-commit lesson file.

## Phases

1. **Phase 1 (build first):** content model, site skeleton, Overview, Unit and Lesson pages, deployed to GitHub Pages, seeded with the Term 4 2026 units.
2. **Phase 2:** Archive with search and filters; import 2026 Terms 1 to 3.
3. **Phase 3:** Live mode and student-facing pages per lesson.
4. **Phase 4 (maybe):** class-level assessment summaries (no student names, see privacy).

## Seed content

Term 4 2026 (current):

| Cohort | Unit | Known lessons |
|---|---|---|
| Foundation | Teddy's New House (D&T + Science) | 1 Home or not a home?; 2 Room detectives; 3 LEGO walls; 4 Roof water test; 5 to 7 to plan |
| Year 1/2 | Stronger Together: Paper Makers (D&T + Chemical Science, VC2S2U05) | 1 Paper Power; 2 Twist It; 3 Weave It; 4 to 7 build to a woven paper carrier |
| Year 3/4 | LEGO Science and Paper Bridges | LEGO Education Science challenges, then a paper bridge task |
| Year 5/6 | micro:bit Game Design with Jacdac | 1 Meet Jacdac; 2 Button Smash (variables); then reaction timer, Simon Says |

2026 Terms 1 to 3 (for the archive, Phase 2):

| Term | Foundation | Year 1/2 | Year 3/4 | Year 5/6 |
|---|---|---|---|---|
| T1 | How things move | Pushes and pulls (ramps, magnet maze, forces book) | Heat (ice rescue, melt race, micro:bit thermometer, Minecraft heat museum) | Light (mirror maze, kaleidoscope, periscope, refraction, Light Quest) |
| T2 | Scratch Jr, weather and seasons | Code.org, Scratch Jr rubbish-sort game | Rocks and minerals (Scratch rock detector, flowchart) | Natural hazards in Minecraft |
| T3 | Basic needs of living things | Features of living things, garden, compost | Living, non-living, once-living | Adaptations, biomimicry, marine gallery, Minecraft fungi |

James will supply full lesson plans and details as needed. Do not invent lesson content: leave clearly marked placeholders.

## Not in scope

- Logins, accounts, databases, servers
- Student names or individual student data
- A class progress tracker or anything needing routine manual entry
- Pre-made CRT versions for every lesson

## Working agreements

- Keep dependencies minimal and the build simple enough to maintain for years (plain HTML/CSS/JS with a small build script, or a light static site generator; recommend one and say why).
- Deploy with GitHub Actions to GitHub Pages.
- Write a `CLAUDE.md` capturing this brief, the content model and conventions once agreed.
- Ask before big structural decisions.
