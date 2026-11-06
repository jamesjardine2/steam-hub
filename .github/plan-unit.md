# Plan a unit for the STEAM Hub

You are running on GitHub because James pressed a button on the hub's Planning page. You were given a plan file (`content/plans/<id>.json`), a round (`directions`, `draft` or `revise`) and maybe notes from James. Nobody can answer questions while you work, so make sensible choices and finish the job. The plan follows backward design: what students should learn, how we will know, then the lessons.

## Read first

1. `CLAUDE.md` (the rules, content model and conventions; follow them all, including VTLM 2.0 first, privacy, no dashes and no invented facts).
2. `PLANNING.md` (the spec for this feature).
3. The plan file. `cohort`, `year`, `term` and `lesson_count` say what is being planned. `answers` holds James's non-negotiables: `focus` (the codes the unit is about: Science Understanding and/or Design and Technologies contexts), `targets` (the codes the unit must cover, the same as `focus`), `digital_tech` (true when the unit should be complemented with Digital Technologies), `report_subject`, `must_use` and `cant_use` (ids from `src/_data/resources.json`), `open_to_buying`, `checking`, `dates`, `links`, `notes`, and `spark` (only when `spark_on` is true).
4. `src/_data/curriculum.json` (codes and summaries), `src/_data/resources.json` (what the room owns), `src/_data/lenses.json` (pedagogy tags).
5. This cohort's earlier units in `content/units/` (folders contain the cohort id, for example `-y12-`), above all the unit from the same term two years ago and its `reflections.md`. Also skim the other cohorts' units for the same term.

## The art and the science of teaching

James's guide "Gut and Evidence in Teaching" sorts every decision:

- **Evidence leads** when a decision affects the whole cohort, shows results only weeks later, is new territory, or chooses a program, resource or assessment. Sequence from concrete to abstract, teach new content explicitly with worked examples, build in retrieval and spaced practice, check for understanding, give feedback tied to the success criteria, and manage cognitive load. This is each direction's **backbone**.
- **Your call** for in-the-moment choices about these students and James's personality: hooks, contexts, stories, humour, which resource makes it fun, following a spark of curiosity. This is each direction's **flair**: ideas to take or leave, never requirements.

The evidence sets the direction; James brings it to life.

## Curriculum: the STEAM pairing first

James wants a genuinely integrated STEAM program, not subjects taught side by side with token links. The heart of every unit is a **pairing** of content: a Science Understanding code and a Design and Technologies context (Technologies Contexts strand) at the cohort's level, where the Science is what students use to design and the design problem is why they need the Science. For example, at Level 5 and 6, VC2S6U09 (conductors, insulators and energy in circuits) pairs with VC2TDE6C01 (electrical energy turned into movement, sound or light in a product): students learn how circuits work because their product needs to light up or move.

- **James's focus codes** (`focus`) are the content the unit is about. They may be Science Understanding codes, Design and Technologies contexts, or both.
- **Pair every focus code with the other area.** If James chose codes in both areas, they are his pairing: use it and explain the link. Otherwise find the partner yourself. `pairs` in `src/_data/curriculum.json` lists links already worked out, each with how they connect; start there, but judge the fit for this unit, and you may choose a partner that is not listed if it is a stronger, genuine link. A link is genuine when students must use the knowledge from one code to succeed in the other. If no genuine partner exists, say so in the pairing rather than forcing one.
- **The pairing must shape the unit,** not sit beside it: the big idea, the LISC, the lesson arc and the assessment should all need both halves.
- **Built in by fit:** Science Inquiry, Science as a Human Endeavour and the other Design and Technologies strands (Technologies and Society, Creating Designed Solutions) are built in where the unit's activities genuinely use them (students predict and fair test, so a Science Inquiry code fits; they design, make and evaluate, so a Creating Designed Solutions code fits). Leave out any that would need an activity added just to tick it off. None is a fine answer.
- **Digital Technologies:** only when `digital_tech` is true. Then make it a real part of the pairing (for example coding a micro:bit to control the circuit, or collecting and graphing test data), and include only the codes that work genuinely uses. When it is false, include no Digital Technologies codes.
- **No other content codes:** do not add Science Understanding or Technologies Contexts codes beyond the focus codes and their partners.

Every code must be in `src/_data/curriculum.json` at the cohort's level (the `2` band covers Foundation to Level 2, and so on).

## Round: directions

Write three directions into the plan's `directions` array, then set `"status": "directions"`. Do not change `answers` or `choices`. If directions already exist, replace them with three fresh ones that take James's newest answers into account.

The three must be genuinely different kinds of unit (for example a design challenge, a scientific investigation and a game or digital build), never three versions of one idea. When the hub has a unit for this cohort from the same term two years ago, one direction is a **remix** of it: keep what its reflections say worked, change what they say to change.

Every direction must cover all of `answers.targets`, use every `must_use` resource, avoid every `cant_use` resource, fit `lesson_count` lessons of 45 minutes, and respect `dates`. Build on owned resources. Only when `open_to_buying` is true may a direction need something not owned; list it under `purchases` and keep the rest of the direction working without it if possible.

Each direction is an object:

```json
{
  "id": "A",
  "title": "Short unit title",
  "type": "design challenge",
  "big_idea": "One sentence students could understand.",
  "lisc": { "intention": "To ...", "criteria": ["...", "...", "..."] },
  "pairing": [{ "codes": ["VC2S6U09", "VC2TDE6C01"], "how": "How the Science and the design need each other in this unit, in a sentence or two." }],
  "built_in": [{ "code": "VC2S6I01", "how": "Groups predict, then test each design the same way." }],
  "assessment": [{ "title": "...", "how": "What James does, in a sentence", "when": "Lesson 6" }],
  "arc": [{ "number": 1, "title": "...", "summary": "One line." }],
  "resources": [{ "id": "microbit", "why": "..." }],
  "purchases": [{ "name": "...", "why": "..." }],
  "connections": [{ "code": "VC2HP2P01", "how": "..." }],
  "pedagogy": [{ "id": "citw.guided_investigations", "level": "focus", "how": "..." }],
  "backbone": ["Evidence-led point", "..."],
  "flair": ["Your-call idea", "..."]
}
```

- `id` is A, B or C. `arc` has exactly `lesson_count` lessons, numbered from 1.
- **Pairing:** every focus code appears in one entry, with its partner from the other area (or alone, with `how` saying why no genuine partner exists). Different directions may choose different partners.
- **Built in:** the Science Inquiry, Science as a Human Endeavour, other Design and Technologies strands and (when `digital_tech` is true) Digital Technologies codes this direction naturally covers, each with one line on how, following the section above. Different directions can build in different codes.
- **LISC:** the overarching Learning Intention starts "To", and three Success Criteria each finish "I can ..." (write them without "I can").
- **Assessment:** two or three options that take James seconds, not organisation: he teaches 450+ students. Prefer evidence that comes from the work itself (Book Creator pages, journal pages, photos of builds, a quick observation checklist against the success criteria, an end-of-unit showcase). Say when it happens. Class level only: never names.
- **Resources:** ids from `src/_data/resources.json`.
- **Connections:** two or three genuine links to other learning areas (Health and Physical Education, The Arts including Music and Visual Arts, Mathematics, English, Humanities), as full Victorian Curriculum 2.0 codes for the cohort's level, each with how the unit links. Only use a code you are confident exists; check it on f10.vcaa.vic.edu.au if you can.
- **Pedagogy:** three to five tags from `src/_data/lenses.json` the direction leans on, with how statements.
- **Backbone** and **flair:** three or four points each, as above. When James turned on his spark, use it in the flair.

## Round: draft

James has chosen in `choices`: for each part (`big_idea`, `assessment`, `arc`, `resources`, `connections`), `from` is a direction id (use that direction's part) or `own` (use James's words in `own`, shaped into the same form). `choices.notes` has his notes. The big idea part includes the LISC. When parts come from different directions, make them fit together, changing as little as you can.

Write the unit folder `content/units/<year>-t<term>-<cohort>-<short-name>/` (short name: two or three lowercase words joined by hyphens):

- `unit.md` in the format in `CLAUDE.md`, with `status: draft`, `plan: <plan id>`, `lesson_count`, `report_subject` (from the answers, leave it out if empty), `curriculum` (the focus codes and their pairing partners from the direction James chose for the big idea, plus the `built_in` codes of the direction he chose for the arc, keeping only those that still fit after mixing; if he wrote his own, choose them afresh by the same rules), the pairing's `how` as the first paragraph of the unit's body description, `connections` (codes), `assessment` (a list of `{ title, how, when }`), and an `outline` entry for every lesson (number, title, summary). Write `focus`, `blurb` and a short body description. Leave `claude_chat` out.
- `reflections.md` with the same instruction comment as the other units' reflection files and no entries.

Then set the plan's `"status": "draft"` and `"unit": { "slug": "<folder name>", "title": "<unit title>" }`. Do not write any lesson files: James plans lessons one at a time from the unit page.

## Round: revise

The draft unit is `content/units/<plan.unit.slug>/`. Change `unit.md` following the notes from James. Keep `status: draft`. Change only what the notes ask for, plus anything that must change to stay consistent. If the change affects the plan's choices, leave the plan file alone.

## Before you finish

- Run `node scripts/check-plan.mjs <plan id> <round>` and fix anything it reports.
- Run `npx @11ty/eleventy` and fix any warning about your files.
- Search your files for en and em dashes and remove them. Ranges use "to".
- No student names anywhere.
