# Curriculum fact sheets (CD objects)

A CD object is a fact sheet for one Victorian Curriculum 2.0 Science content description: what it asks, what students get wrong, and where to start. This is a trial (November 2026). There are four so far: VC2S6U08, VC2S2U05, VC2S2U12 and VC2S4U10. James asks for each one. Do not add more until he asks.

## What is in this folder

```
content/cd/
  README.md         this file
  cd.schema.json    the format, as a JSON Schema
  objects/          one JSON file per content description, named <CODE>.json
  index.json        the list of fact sheets, written by the checker (never edit by hand)
  cycle.json        the school's two-year Science cycle, drawn as the table on the front page
  index.html        the page (plain HTML)
  cd.js             draws a fact sheet from its JSON file
  cd.css            layout for the page (colours come from src/assets/tokens.css)
scripts/check-cd.mjs   the checker
```

The whole folder is copied to the site as `/cd/`. A fact sheet is at `/cd/?code=VC2S6U08`. The front page, `/cd/`, is the Science cycle, from `cycle.json`, and is in the hub's top navigation (`index.html` has its own copy of the navigation bar: keep it in step with `src/_includes/base.njk`): one grid with a column for each strand and a row for each year level, and a switch for odd or even years (it starts on odd years and names no calendar years, and Foundation is the same every year). The strands run Physical, Earth and space, Biological, Chemical, left to right. Each item shows a short statement in our own words (`short`, a few words that name the idea, the same as the fact sheet's title where there is one) and its code. The Official wording button adds the VCAA wording of each content description (`text`, copied by script from the local copy of the curriculum, with the VCAA credit line under the table). A code with a fact sheet gets a Fact sheet link, and the fact sheet links back, so a new fact sheet shows up in the grid with no extra step. `eu` is the school's enduring understanding each item was matched from (its Concept Curriculum Scope and Sequence): it is kept as a record and not shown, because James found some of them ambiguous. A composite year level is one group: do not add notes such as "Year 5 only", because if Year 5 does it, Year 6 does too (James, November 2026). The matches and short statements were made by Claude, and James approved them on 15 November 2026 (`"matched": "approved"`). If you change a match or a short statement, set `"matched": "draft"` so the note under the table comes back until James approves it again. The checker makes sure each code is a real Science Understanding code at that row's level and strand, and that `text` matches the local copy word for word. There is nothing to build for the page itself. Two links are made by the hub's build (`src/_data/site.js`): a unit page shows "Fact sheet: ..." under its curriculum codes when a code in `unit.md` has a fact sheet, and `/cd/units.json` tells the fact sheet which units to link back to.

## The format

Each file has the eleven fields below. `cd.schema.json` is the full definition, with a description on every field.

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
| 11 | `assessment` | `can_do`: plain statements of what a student who has it can do. `quick_checks`: two to five quick, age-appropriate checks, each with `how` and `look_for`. `extend`: strategies for students who already have it. `support`: strategies for students `below` and `well_below` the level |

**The map (November 2026).** When `related` has a `links` list, the page draws field 8 as a map: levels down the side (lowest at the top), a column each for Science, Design and Technologies and Digital Technologies, a small box for each row (it opens the code on the VCAA site) and a line for each link. The written rows fold away under "Why each one is linked". For the map, every row needs a `label` (two to four words for its box), and each link is `{ "from": code, "to": code, "kind": ... }`: `leads` (an arrow: `to` builds on `from`), `connects` (a strong link at the same stage, such as a STEAM pairing) or `loose` (dashed, a weaker link). Only add a Technologies box where the link is genuine, and leave a column empty when it is not. Without `links`, the page shows the plain list (VC2S6U08 does). The other three have the map, so give a new fact sheet one too.

**Assessment (field 11).** James asked for it in November 2026: he wants each sheet to hold things he will definitely use, with a balance of theory, teaching approaches and practical ideas. Write `can_do` from the achievement standard sentence, one observable thing per line. Quick checks must work with a whole class inside a 45-minute lesson, say how long they take, and say what to look for (has it, not yet), using the misconceptions where they help. Never record or name students on the hub. Extension goes deeper at the same level before it reaches for the next level's content. Support strategies are general adjustments: say that a student's individual plan and the classroom teacher's advice come first. It is shown after the key questions. James judged the sample on VC2S2U12 and asked for it on every sheet, so every fact sheet has it.

There are also `sources` (every source, each with an `id`) and `unverified` (a plain list of what could not be checked). There is no teaching time: that belongs to the unit.

## Status: a record in the file, not shown on the page

James asked on 15 November 2026 for the labels to go. The page shows no Verified, Approved or Draft labels, no "Check:" notes and no "Could not be checked" card. It shows the content and the numbered source links, which is how a reader tells what rests on research. Treat what you write as ready for James to use. Do not add a label, a note or a card to the page asking him to review something. If something is a guess worth a second look, tell him in the chat.

The `status`, `note` and `unverified` fields stay in each file as a record of where things came from. Keep filling them in honestly as below: the checker still enforces them.

Every field, and every item in a list, has a `status` and a `sources` list.

- `verified` means the content was checked against a source that you opened and read in this session, and that source is named in `sources`. The checker refuses `verified` without a read source.
- `draft` means it is your own judgement and James needs to review it. A draft can still list sources that informed it.
- `approved` means it is your own judgement and James has reviewed and approved it. Only James can do this: write new judgement fields as `draft`, and change them to `approved` (and set `approved_on` to that date) only when he says so. Never use `verified` for this, because nothing was checked against a source. James approved every draft field on the first four fact sheets on 15 November 2026.

Use `note` to say exactly what was checked and what was not, for example "The code and its wording were checked on the VCAA page. The link to light is my judgement."

Sources have `read: true` (you opened it: give `url` and `accessed`) or `read: false` (a study you know only because a read source cites it: give `via`, the id of that read source). Never mark a study as read because you remember it. If something cannot be checked, do not guess. Mark it `draft` and add a line to `unverified`.

## How to add a CD object

Work through these steps in order. Do one content description at a time.

0. **The local copy is as good as the site.** `VC2_Science_DigiTech_DesignTech_F-10.md` (to read) and `.json` (to copy the wording by script) in the repo root are the same as the VCAA's official version (James confirmed this on 15 November 2026). Use them whenever the VCAA site cannot be reached. Cite the Victorian Curriculum itself as the source, as `objects/VC2S2U12.json` does: do not mention the local copy on a fact sheet, and do not flag wording taken from it as unchecked.
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
