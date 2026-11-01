# Make a CRT plan for the STEAM Hub

You are running on GitHub because James pressed "Make a CRT plan" on a lesson page. You were given a unit folder, a lesson number and optional notes from James. Nobody can answer questions while you work, so make sensible choices and finish the job.

A CRT (casual relief teacher) takes the lesson when James is away. They do not know the class, the room or the unit, and they may arrive minutes before the bell. The CRT plan is printed, so it must work on paper alone.

## Read first

1. `CLAUDE.md` (the rules; follow them all).
2. `content/units/<unit>/unit.md`.
3. The lesson file `content/units/<unit>/lessons/NN-*.md` (two-digit number) and the lesson before it, so you know what the class did last time.
4. The CRT plans James already uses, which set the style and the level of detail:
   - `content/units/2026-t4-y12-paper-makers/lessons/01-paper-power.pdf`, `02-twist-it.pdf` and `03-weave-it.pdf` (CRT plans from James's earlier chats; skip them if they will not open).
   - `content/units/2026-t4-y12-paper-makers/crt/04-crt.html` (the HTML layout to copy).
5. Any existing `content/units/<unit>/crt/NN-crt.html` for this lesson. If it exists, James wants a new version: rewrite it following his notes.

## Write

`content/units/<unit>/crt/NN-crt.html`, a copy of `04-crt.html` with the same `<head>` links (the font, `tokens.css` and `crt.css`, which hold all the styling) and the same section order. Do not add a `<style>` block or any colour codes: drawings use the tokens, for example `stroke="var(--violet)"`. The PDF is printed on white paper, so keep drawings light: outlines in `--violet`, `--line` or `--solar-orange`, fills in `--glow` or `--white`, and text in `--violet` or `--line`.

1. Header: "Lesson N: Title", then "Year X/Y STEAM | Unit: ... | CRT plan | 45 minutes".
2. Amber note: how much preparation is needed (aim for "No preparation needed"), "No screens are used", what goes into the STEAM journal, and that journals are on the shelves as you walk in the door.
3. Learning Intention and Success Criteria, exactly as in the lesson file, read aloud at the start and the end.
4. What you need: a table of item, how many, used for.
5. How to do the activity: three simple SVG drawings of the key steps, then the steps as bullet points.
6. Key words.
7. Lesson sequence: six steps adding up to 45 minutes, with what to do and say, including the questions to ask in quotes.
8. Write this on the board, with a sentence stem.
9. Questions to ask while roaming.
10. Support and extension.
11. Key idea to finish on.
12. Notes for the teacher: the common mistakes, safety, anything that must be kept for next lesson, and "Please leave a short note about how far the class got and any students who were absent."
13. Curriculum links.

## How to change the lesson for a CRT

Keep the same Learning Intention and Success Criteria. Change how the lesson runs:

- **No screens.** Drop slides, live artefacts, iPads, Book Creator, videos and websites. Replace a slide or animation with something the CRT can do at the board, a demonstration, or a drawing in the plan.
- **Few resources.** Use only what any classroom has: paper, scissors, pencils, glue sticks, sticky tape, STEAM journals, plus anything the lesson cannot work without. Swap special materials for everyday ones where the learning stays the same. Say exactly how many of each.
- **No preparation.** Student helpers hand things out during the lesson. If a step truly needs preparation (an allergy check, covering tables), keep it short and put it first in the amber note.
- **Explain everything.** Script the hook and the modelling. Give the expected answers in brackets. Assume the CRT has never seen the unit.
- **Records go in STEAM journals.** Students glue work in and write the date and lesson title.
- **Anything for next lesson** (things drying, models to keep) gets a clear note so it is not thrown away.
- Apply James's notes on top of all of this (for example "no scissors" or "the class is out of flour").

## Rules

- VTLM 2.0 first: keep the plan focused on what the CRT needs to run the lesson. Short steps, no padding.

- Never use em dashes, en dashes or a spaced hyphen as punctuation. Use "to" for ranges. Scan what you wrote with `grep -nP '[\x{2013}\x{2014}]' <file>` before you finish.
- Never include student names or anything that identifies a student.
- Australian spelling.
- Do not copy images or text from the web. Draw pictures in simple SVG.
- Only write `content/units/<unit>/crt/NN-crt.html`. Do not change the lesson file or anything else.
- Do not make the PDF or commit; the workflow does that.
