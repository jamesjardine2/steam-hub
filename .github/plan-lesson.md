# Plan a lesson for the STEAM Hub

You are running on GitHub because James pressed "Plan with Claude" (or "Send to Claude" on a draft) on his STEAM Hub. You were given a unit folder, a lesson number and optional notes from James. Nobody can answer questions while you work, so make sensible choices and finish the job.

## Read first

1. `CLAUDE.md` (the rules, content model and conventions; follow them all).
2. `content/units/<unit>/unit.md`, especially the `outline` entry for this lesson, the unit LISC and the curriculum codes.
3. Every lesson file in `content/units/<unit>/lessons/`, so the new lesson follows on from the last one and matches their structure and tone.
4. `templates/README.md` (the lesson file spec).
5. The previous lesson's live artefacts in `content/units/<unit>/live/` (its `NN-slides.html`, `NN-frayer.html` and animated how-to page).

## If the lesson file already exists

James wants changes. Revise the lesson file and its artefacts following his notes. Keep `status: draft`. Change only what the notes ask for, plus anything that must change to stay consistent.

## If it does not exist yet

Write `content/units/<unit>/lessons/NN-short-name.md` (two-digit number) with:

- `status: draft`
- The outline entry's title and idea as the starting point, adjusted by James's notes.
- A LISC in the exact format (intention starts with "To"; three criteria that finish "I can ...").
- `curriculum`, `vtlm` and `citw` tags (allowed values only), `sequence` (six steps adding up to 45 minutes), `resources`, `crt_notes`, and a `live` list naming the three artefacts below.
- A full plan body in the same sections as the earlier lessons: the setup note, how the activity works with key words, the lesson sequence table with what to do and say, what to draw on the board, roaming questions, support and extension, the key idea, notes for the teacher (include safety where relevant) and curriculum links.

Then remove this lesson's entry from the `outline` in `unit.md`.

## Artefacts (new lesson)

Make three projector pages in `content/units/<unit>/live/`, each copied from the previous lesson's matching page so the layout, controls, colours and `?embed` mode stay the same:

- `NN-slides.html`: title, a recall of last lesson, the CIC hook (two or three slides), any safety slide needed, the LISC, the word wall and the how-to embedded with `?embed`, and a "Record it" slide when there is something to record.
- `NN-frayer.html`: Frayer models for three key words from the lesson, each with simple drawn SVG pictures for the examples and non-examples.
- `NN-<activity>.html`: an animated how-to with four to six steps that shows students exactly what to do, drawn in SVG.

## Rules

- Never use em dashes, en dashes or a spaced hyphen as punctuation. Use "to" for ranges. Scan everything you wrote with `grep -rnP '[\x{2013}\x{2014}]' content/` before you finish.
- Never include student names or anything that identifies a student.
- Australian spelling. Slide text short and readable for Year 1 and 2.
- Do not copy images or text from the web. Draw pictures in SVG.
- Only change files in `content/units/<unit>/`.
- Check the site still builds with `npx @11ty/eleventy`.
- Do not commit; the workflow does that.
