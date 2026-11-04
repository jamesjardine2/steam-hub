# Writing lessons for the STEAM Hub

Paste this into the instructions of a pinned planning chat (for example "1/2 Term 4"). After writing each lesson plan, ask the chat for "the hub file" and it will output one Markdown file ready to commit.

## Instructions for Claude

When I ask for the hub file for a lesson, output a single Markdown file with YAML frontmatter, exactly in the shape below, in one code block. Then tell me the filename.

**Filename:** two-digit lesson number, then a short lowercase name with hyphens, for example `04-paper-chains.md`. It goes in `content/units/<unit folder>/lessons/` in the steam-hub repo. If there is a plan PDF, save it next to the file with the same name, for example `04-paper-chains.pdf`.

**Frontmatter fields:**

- `number`: the lesson number.
- `title`: the lesson title.
- `summary`: one line describing the lesson, for the unit's lesson list.
- `status`: `planned`, or `draft` if the plan is not finished.
- `duration`: minutes, usually 45.
- `lisc`: `intention` (starts with "To") and `criteria` (a list, each finishing the sentence "I can ...", without the words "I can").
- `curriculum`: Victorian Curriculum 2.0 codes for this lesson, for example VC2S2U05.
- `vtlm`: the VTLM 2.0 elements used. Only these values: Focus the learning; Explicit explanation and modelling; Scaffold practice; Monitor progress.
- `citw`: the CITW strategies used. Only these values: CICs; Vocabulary; Frayer model; Strategy instruction and modelling; Worked examples.
- `pedagogy` (optional): a map of tag id to `level` and `how`. Ids come from `src/_data/lenses.json` in the hub (for example `vtlm.explicit.scaffold`, `citw.interest_cues`, `pcms.6`, `vc.dt`). `level` is `focus` for 1 to 3 practices the lesson deliberately targets and `present` for others that happen. `how` is at least one sentence on how this lesson uses the practice, naming the actual activity (for example "Groups drip 10 drops on four materials and check the towel underneath"). Don't tag routines such as `fcps.values`.
  ```yaml
  pedagogy:
    citw.guided_investigations:
      level: focus
      how: "Groups predict, then drip water on four materials to find the best roof."
  ```
- `sequence`: the lesson at a glance, each with `phase` (Hook, I do, We do, You do, Review), `time` (for example "5 min") and `what` (one sentence).
- `resources`: a list of materials. To link one to a file in the unit's `live/` folder (a handout, say), write it as `- text: ...` with `file: name.webp` on the next line (or `url:` for a link).
- `live`: artefacts to show on the projector, each with `kind` (SLIDE, HTML, IMG, VIDEO or LINK), `title`, `note`, and either `file` (a file in the unit's live folder) or `url`.
- `crt_notes`: two or three sentences on what would change if a CRT took the lesson, keeping the same Learning Intention.

**Body:** the full lesson plan in Markdown, using level-2 headings.

**Rules:**

- Never include student names or anything that identifies a student.
- Do not use em dashes, en dashes or a spaced hyphen as punctuation. Use "to" for ranges.
- Put text in double quotes in the frontmatter if it contains a colon.
- If something is not decided yet, write a placeholder in square brackets, for example `[Resources to confirm]`.

## Example

See `templates/lesson.md` for a blank file and `content/units/2026-t4-y12-paper-makers/lessons/03-weave-it.md` for a filled one.

## Reflections

To file a reflection, ask the chat for "a hub reflection" and add it to the unit's `reflections.md`:

```
## 2026-11-03 · Lesson 3 · 1/2A
What happened, what to change next time.
```
