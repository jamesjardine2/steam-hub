# Curriculum fact sheets (CD objects)

A CD object is a fact sheet for one Victorian Curriculum 2.0 Science content description: what it asks, what students get wrong, and where to start. This is a trial (November 2026) with two samples, VC2S6U08 and VC2S2U05. James decides whether to do the rest. Do not add more until he asks.

## What is in this folder

```
content/cd/
  README.md         this file
  cd.schema.json    the format, as a JSON Schema
  objects/          one JSON file per content description, named <CODE>.json
  index.json        the list of fact sheets, written by the checker (never edit by hand)
  index.html        the page (plain HTML)
  cd.js             draws a fact sheet from its JSON file
  cd.css            layout for the page (colours come from src/assets/tokens.css)
scripts/check-cd.mjs   the checker
```

The whole folder is copied to the site as `/cd/`. A fact sheet is at `/cd/?code=VC2S6U08` and the list is at `/cd/`. There is nothing to build for the page itself. Two links are made by the hub's build (`src/_data/site.js`): a unit page shows "Fact sheet: ..." under its curriculum codes when a code in `unit.md` has a fact sheet, and `/cd/units.json` tells the fact sheet which units to link back to.

## The format

Each file has the ten fields below. `cd.schema.json` is the full definition, with a description on every field.

| Field | Key | What goes in it |
| --- | --- | --- |
| 1 | `descriptor` | The code's official wording, copied exactly from the VCAA site, with the link and the credit line |
| 2 | `paraphrase` | What it is really asking, in plain English, the ideas inside it, and what is not part of it |
| 3 | `key_questions` | Three to five questions, each with `know`, `understand` and `do` |
| 4 | `vocabulary` | Words in three tiers: `everyday`, `academic`, `science` |
| 5 | `misconceptions` | What students think (`idea`), the accepted idea (`science`), a way to bring it out (`respond`), the studies (`research`) |
| 6 | `inquiry` | Science Inquiry codes at the same band, and how each shows up |
| 7 | `human_endeavour` | Science as a Human Endeavour hooks. `first_nations: true` marks First Nations science perspectives |
| 8 | `related` | Related content descriptions `below`, `same` and `above`, with codes |
| 9 | `anchors` | Two or three anchor experiences for a 45-minute lesson in a room with no storeroom |
| 10 | `pitfalls` | Teacher-side pitfalls, each with what to do `instead` |

**The map (on trial, VC2S2U05 only, November 2026).** When `related` has a `links` list, the page draws field 8 as a map: levels up the side, a column each for Science, Design and Technologies and Digital Technologies, a small box for each row (it opens the code on the VCAA site) and a line for each link. The written rows fold away under "Why each one is linked". For the map, every row needs a `label` (two to four words for its box), and each link is `{ "from": code, "to": code, "kind": ... }`: `leads` (an arrow: `to` builds on `from`), `connects` (a strong link at the same stage, such as a STEAM pairing) or `loose` (dashed, a weaker link). Only add a Technologies box where the link is genuine, and leave a column empty when it is not. Without `links`, the page shows the plain list (VC2S6U08 does). Do not add the map to another fact sheet until James asks.

There are also `sources` (every source, each with an `id`) and `unverified` (a plain list of what could not be checked). There is no teaching time: that belongs to the unit.

## Status: the rule that matters most

Every field, and every item in a list, has a `status` and a `sources` list.

- `verified` means the content was checked against a source that you opened and read in this session, and that source is named in `sources`. The checker refuses `verified` without a read source.
- `draft` means it is your own judgement and James needs to review it. A draft can still list sources that informed it.

Use `note` to say exactly what was checked and what was not, for example "The code and its wording were checked on the VCAA page. The link to light is my judgement."

Sources have `read: true` (you opened it: give `url` and `accessed`) or `read: false` (a study you know only because a read source cites it: give `via`, the id of that read source). Never mark a study as read because you remember it. If something cannot be checked, do not guess. Mark it `draft` and add a line to `unverified`.

## How to add a CD object

Work through these steps in order. Do one content description at a time.

1. **Get the official data.** Download `https://f10.vcaa.vic.edu.au/learning-areas/science/curriculum` (with `curl -sL`). The page holds all the content descriptions as data: search the file for `"code":"VC2S6U08"` to find the `contentDescription`, the `elaborations`, the `strand` and `subStrand`, and the `achievementExtracts` (the achievement standard sentence). Copy the description text with a script, never by retyping it and never from memory.
2. **Copy a sample.** Copy `objects/VC2S6U08.json` to `objects/<CODE>.json` and change every field. Keep `schema_version` at 1 and set `updated` to today.
3. **Fill `descriptor`.** `stem` and `text` exactly as the VCAA has them, `url` ending in `#<CODE>`, status `verified`, sources `vcaa-science` and `vcaa-copyright`. Keep the `attribution` line as it is in the samples: the VCAA licence (CC BY-NC 3.0 Australia) allows copying with that credit.
4. **Find the neighbours for `related`.** Use the same downloaded page. Read every Science Understanding description in the same sub-strand at the other bands, and search all the descriptions and elaborations for the topic's key words. Write each `summary` in your own words. If a band has nothing, add a row with `gap: true` saying so. Codes above Level 6 are allowed.
5. **Fill `inquiry` and `human_endeavour`.** Use codes at the same band only (`VC2S6I..` and `VC2S6H..` for Levels 5 and 6). A link is `verified` when a VCAA elaboration for that code uses this topic as its example, and `draft` when the link is your own idea. For First Nations perspectives, use only what a VCAA elaboration or a named First Nations source says, say in the `note` how far it was checked, and leave it out if it is not genuinely relevant.
6. **Research the misconceptions.** Search for published science education research on student ideas about the topic. Good open sources: IOPSpark misconception pages (`spark.iop.org`, physics, with references), Best Evidence Science Teaching diagnostic questions, the Research-2-Practice booklet (`ray.yorksj.ac.uk/5961/`), the ASE Journal of Emergent Science. Journal sites often block downloads. If you cannot open a study, cite the summary you did read and list the study with `read: false` and `via`. Write each `idea` in your own words. If you find no research, write the misconception as `draft` and say so in `unverified`.
7. **Write the rest** (`paraphrase`, `key_questions`, `vocabulary`, `anchors`, `pitfalls`). These are mostly `draft`. Anchors must work in 45 minutes with everyday materials and what the STEAM room owns (`src/_data/resources.json`, owned items only). Keep to what the description asks: check the paraphrase against the achievement standard sentence.
8. **Fill `unverified`.** List plainly everything you could not check.
9. **Check it.** Run `npm run check-cd -- --write`. It checks the file against the schema, checks the status and source rules, checks the codes against `src/_data/curriculum.json`, checks for dashes, and rewrites `index.json`. Fix every error it prints and run it again until it prints `ok`.
10. **Look at the page.** Run `npm start` and open `http://localhost:8080/steam-hub/cd/?code=<CODE>`. Open each section and read it once as James would.

## Writing rules

- No em dashes, no en dashes, and no spaced hyphen used as a dash. Write ranges with "to" (ages 5 to 7, pages 83 to 93). The checker fails the file otherwise.
- Australian spelling. Plain sentences a busy teacher can scan.
- The site is public. No student names or anything that identifies a student.
- Do not copy wording from research papers or teaching sites. Summarise in your own words and cite. The one exception is the VCAA description itself, which is quoted with its credit line.
- Do not invent content. An honest `draft` or a line in `unverified` is always better than a confident guess.

## Changing the format

If a field needs to change, change `cd.schema.json`, `cd.js`, both sample files and this README together, then run the checker. Ask James before changing the ten fields.
