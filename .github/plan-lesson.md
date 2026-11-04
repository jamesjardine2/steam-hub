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
- `curriculum`, `vtlm` and `citw` tags (allowed values only), and `pedagogy` tags (ids from `src/_data/lenses.json` only, each with `level` (1 to 3 as `focus`, others `present`) and `how`, a sentence saying how this lesson uses that practice by naming the actual activity; no routine nodes), `sequence` (six steps adding up to 45 minutes), `resources`, `crt_notes`, and a `live` list naming the three artefacts below.
- A full plan body in the same sections as the earlier lessons: the setup note, how the activity works with key words, the lesson sequence table with what to do and say, what to draw on the board, roaming questions, support and extension, the key idea, notes for the teacher (include safety where relevant) and curriculum links.

Then remove this lesson's entry from the `outline` in `unit.md`.

## Artefacts (new lesson)

Make three projector pages in `content/units/<unit>/live/`, each copied from the previous lesson's matching page so the layout, controls and `?embed` mode stay the same.

Styling is shared: every page loads `../../../assets/theme.js` (with `data-area="live"`) and `../../../assets/live.js` (with `defer`; it keeps the top and bottom bars hidden until hovered) in the head, links the font, `../../../assets/tokens.css` and `../../../assets/live.css`, keeps the "Light mode" switch button in its top bar, and has no `<style>` block of its own and no colour codes. The stage div has a family class (`stage deck`, `stage frayer` or `stage howto`). Pages must work in light and dark mode, so drawings use the theme roles for neutrals: `--paper` (paper, flour), `--ink` (labels), `--panel` and `--panel-2` (backgrounds), `--border`, `--text-violet` (outlines); accents (`--violet`, `--solar-orange`, `--ion-cyan`, `--plasma-pink`, `--volt-blue`) are used as fills. For example `fill="var(--paper)" stroke="var(--text-violet)"`. In scripts, `T("paper")` gives a token's hex value. Colour carries meaning, the same in every lesson: give each slide its role class, `hook` (orange, think about it), `safety` (pink), `recall` (blue, last lesson), `record` (cyan) or none (violet, for the title, Learning Intention and anything else). Keep student text in `--glow`. If the unit has `live/pictures.js` or `live/kit.js`, load it and draw objects with `picSvg("name")` (add new pictures there in the same style) instead of drawing them again in each page. For Foundation, use pictures over words: one short line per slide, a picture-talk slide per object students discuss.

- `NN-slides.html`: title (just "Lesson N" and the lesson name), a recall question about last lesson, the CIC hook (two or three slides), any safety slide needed, the Learning Intention and the Success Criteria (two slides), the word wall and the how-to embedded with `?embed`, and a "Record it" slide when there is something to record.
- `NN-frayer.html`: Frayer models for three key words, each with simple drawn SVG pictures for the examples and non-examples. Choose words that carry the lesson's concept (usually from the Learning Intention, the key idea or the sentence stem) and that students would not already use well: subject words (property, material, variable) and precise academic words, not everyday words most of the class can already explain (mix, sticky, strong, big). If the lesson's big idea needs an everyday word, sharpen it into the subject term instead. Non-examples should be near misses that test the idea (for "new material": folded or woven paper, which is still paper), not unrelated things.
- `NN-<activity>.html`: an animated how-to with four to six steps that shows students exactly what to do, drawn in SVG.

## Rules

- **VTLM 2.0 first, especially Attention and Focus.** Strip everything that is not the core focus. Slides: one idea per slide, a short question or statement (aim for 10 words or fewer in the big line, one short supporting line at most), no answer under a question, no decoration. The Learning Intention and the Success Criteria go on two separate slides, worded exactly as in the lesson file. Word wall covers show only the box name.

- Never use em dashes, en dashes or a spaced hyphen as punctuation. Use "to" for ranges. Scan everything you wrote with `grep -rnP '[\x{2013}\x{2014}]' content/` before you finish.
- Never include student names or anything that identifies a student.
- Australian spelling. Slide text short and readable for Year 1 and 2.
- Do not copy images or text from the web. Draw pictures in SVG.
- Only change files in `content/units/<unit>/`.
- Check the site still builds with `npx @11ty/eleventy`.
- Do not commit; the workflow does that.
