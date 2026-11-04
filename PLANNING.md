# Planning: spec (draft, November 2026)

A Planning section in the hub where planning starts, instead of a blank chat. It follows backward design (Understanding by Design): decide what students should learn, then how we will know they learned it, then the lessons. The hub asks short questions to pin down the non-negotiables, Claude suggests a range of directions, and James chooses or mixes at every step.

Status: step 1 (data) is built: `src/_data/curriculum.json`, `src/_data/resources.json`, links for every learning area and `connections` on units and lessons. Steps 2 to 6 are not built yet.

## 1. What it plans

Three kinds of plan, in this build order:

1. **A unit:** one cohort, one term. Ends as a draft `unit.md` (title, overarching LISC, curriculum codes, cross-curriculum links, assessment plan, lesson outline). Lessons are then planned one at a time with the existing "Plan Lesson N with Claude" button.
2. **A single lesson:** a standalone lesson, incursion or event day (for example a high school lab visit). Ends as a draft lesson file in a small "one-off" unit for that term.
3. **A year map:** every cohort across the year, and across the two-year cycle, showing which Science and Technologies codes each cohort covers and where the gaps are. It is the starting point for choosing curriculum targets in a unit plan.

## 2. How it runs

The survey and every choice happen on the page, instantly. Claude works in two rounds through GitHub Actions (a new `plan-unit.yml`, the same pattern as Plan with Claude), each taking about 5 to 10 minutes. Everything is saved in the repo, so a plan can be left and picked up on another device.

```
Step 1  What the hub knows        (page, no typing)
Step 2  Non-negotiables           (page, survey)
Step 3  Your spark (optional)     (page, open prompts, only when James turns it on)
Round 1 Directions                (Claude, about 5 to 10 minutes)
Step 4  Pick and mix              (page)
Round 2 Draft unit                (Claude, about 5 to 10 minutes)
Step 5  Approve or ask for changes (page, like approving a lesson)
```

A plan in progress is saved as `content/plans/<year>-t<term>-<cohort>.md`: the answers, the directions Claude offered and the choices made. Once approved it becomes the unit folder, and the plan file stays as a record of why the unit looks the way it does.

### Step 1: what the hub knows

Shown, not asked: the cohort, the classes, `lesson_count`, last term's unit, the unit this cohort did two years ago (the last time round the cycle), the other cohorts' units this term, and the curriculum codes this cohort has covered in the cycle so far.

### Step 2: non-negotiables

About five short screens, filled in from last time where possible:

1. **Curriculum targets.** Tick codes from the Science and Technologies F to 6 list (both Design and Technologies and Digital Technologies), grouped by strand. Codes the cohort hasn't covered in this cycle are marked "suggested", but James chooses.
2. **Learning area for reports.** Which reporting subject this unit feeds (now: Digital Technologies in Semester 1, Design and Technologies in Semester 2; a setting, since it may change).
3. **Resources and spaces.** Tick must-use and can't-use from the resource library (section 4). "Open to buying something new" is a tick box: Claude can then suggest purchases.
4. **Dates and events.** Lessons lost, excursions, visits, showcase dates.
5. **Links.** The classroom inquiry unit this term, if any, and anything else that must connect.

### Step 3: your spark (optional)

Only when James turns it on for this plan. Open prompts with no defaults: what excites you about this topic, a story you could tell, a local or Country link, something you've noticed this cohort loves.

### Round 1: directions

Claude suggests three genuinely different directions (for example a design challenge, a scientific investigation and a game build, never three versions of one idea). On the two-year cycle, one of them is always "remix what we did last time", with what the unit's reflections said to keep, cut and change. Each direction has:

- a big idea and an overarching LISC
- two or three easy assessment options (section 6)
- a lesson arc that fits `lesson_count`
- the resources it uses, and any suggested purchase marked as one
- cross-curriculum links (section 5)
- the pedagogy tags it leans on, with how statements

### Step 4: pick and mix

James picks part by part: one direction's big idea, another's assessment, his own lesson arc. Every part has "write my own". Notes for Claude go in a box, as on the draft lesson page.

### Round 2: draft unit

Claude writes the unit folder from the choices: `unit.md` with the outline, plus an assessment plan. The unit page shows it as a draft with "Approve" and "Ask for changes".

## 3. The art and the science of teaching

Built on James's "Gut and Evidence in Teaching" page. Its quick checks already sort planning decisions, so every question and every part of a direction is labelled:

- **Evidence leads** (teal): decisions that affect the whole cohort, show results weeks later, or are new territory. Curriculum targets, sequencing, how understanding is checked, explicit teaching, retrieval and spaced practice, feedback. These come with a research-backed default James can change, and Claude says what the evidence is.
- **Your call** (marigold): decisions in the moment, about this class, or that rely on James's personality. Hooks, contexts, stories, humour, which resource makes it fun. Open prompts, no defaults.
- **Both** (violet): where they meet, for example following a brilliant off-track question, or building a new relationship with a class.

In each direction Claude separates the **evidence backbone** (what the plan must do) from the **flair** (ideas to take or leave), so James can see which is which. The page carries the guide's closing line: the evidence sets the direction, you bring it to life.

## 4. Resource library

`src/_data/resources.json`, in the same shape as `lenses.json`. Each item has a name, kind (kit, app, web app, game, material, space, partner), how many, which year levels it suits, what it needs (iPads, booking, internet, a bus), the curriculum strands it fits, and `owned: true` or `false` (ideas to buy). Claude only builds directions around owned items, and marks anything else as a suggested purchase.

**Owned now** (James to check the counts marked ?):

| Kind | Items |
|---|---|
| Coding and electronics | 30 micro:bits; 15 KittenBot Jacdac Kit A sets; about 12 Makey Makey kits (?); a class set of Spheros (about 15?) |
| LEGO | 7 LEGO Education Science K to 2 kits; 7 LEGO Education Science 3 to 5 kits; a big class set of LEGO bricks and base plates (a tub per pair, plenty spare) |
| iPads and apps | 30 iPads; 28 Apple Pencil style styluses (Kmart); Book Creator (paid); Minecraft Education; Procreate; Google apps; web apps over the internet (for example Scratch, Tinkercad) |
| Science and machines | simple machine demonstration models; kitchen chemistry (oil, flour, vinegar, bicarb soda, cream of tartar, food dye and similar); magnets; balloons |
| Making and craft | air dry clay; plasticine; icy pole sticks; straws; paper plates; pipe cleaners; pebbles; shells; matchsticks; skewers; paper; card; foil; baking paper; paint sticks; markers |
| Spaces | garden, with a class set of gardening tools that needs replacing |

**Ideas to consider buying** (listed with `owned: false`, for James to accept or delete):

- **Bee-Bot or Blue-Bot floor robots:** coding for Foundation to Year 2, where micro:bits are too much.
- **Cardboard construction tools** (for example Makedo, or simply safety cutters and screws): turns recycled boxes into a design and technologies material for every year level.
- **Digital microscopes or iPad clip-on lenses:** science observation that ends in a photo for Book Creator.
- **A new class set of gardening tools,** plus seed trays: already on James's list.
- **Basic food technology kit** (chopping boards, safe knives, bowls): opens up the Design and Technologies to Health link through food.
- **Servo motors and sensors for the micro:bits:** extends the existing kits into moving builds.

Spaces and partners to add as they're confirmed: high school science lab visits, and any community partners.

## 5. Curriculum and connections

- **Codes:** `src/_data/curriculum.json` lists every Science, Design and Technologies, and Digital Technologies content description from Foundation to Level 6: code, learning area, level band, strand, a short summary in our own words, and the VCAA link. The full wording stays on the VCAA site (VCAA owns it and this site is public).
- **Links:** `lib/vc2.js` links every learning area (it currently links Design and Technologies, Digital Technologies, Science and Mathematics, and falls back to the VCAA search for the rest). All Science and Technologies links are checked, like `npm run check-links`.
- **Cross-curriculum connections:** a unit and a lesson can list `connections:` codes from other learning areas (Health and Physical Education, The Arts including Music and Visual Arts, Mathematics, English and others). Claude suggests them in each direction, for example Design and Technologies with Health through food, Science with Music through sound, or Digital Technologies with Mathematics through coordinates. They show as chips beside the curriculum codes, in a second colour.
- **Coverage:** the year map shows which codes each cohort has covered across the two-year cycle. It needs 2026 Terms 1 to 3 in the hub (the Phase 2 import), so coverage starts partial and fills in as units are added.

## 6. Assessment, kept easy

With 450+ students, assessment has to take seconds, not organisation. The aim is evidence that feeds semester reports with almost no extra work.

**Built into every lesson (no extra effort):**

- **Success criteria thumbs:** already the end of most lessons.
- **Hinge question:** one quick question in the slides before students start the task, showing who is ready.
- **Book Creator or journal photo:** the record slide becomes the evidence.

**Class level, one tap (new manual entry, needs James's OK because it changes the "class ticks only" rule):**

- **Class pulse:** after a lesson, on a phone, tap how the class went on each success criterion: most, some or few. Saved like a tick, one commit. Over a unit it shows which criteria need revisiting.

**For semester reports (no student data in the hub at all):**

- **Comment bank:** for each unit, Claude writes report comments at three levels (working towards, at, above the standard), using the unit's success criteria and the achievement standard for the reporting subject. James decides each student's level in the school's reporting system and pastes the matching comment. This is the biggest time saver and keeps names out of the hub completely.

**Student level (optional, later, and only if the school agrees):**

- **Encrypted observation notes:** a quick "spotlight" routine, observing about 5 students a lesson so every student gets a note across the term. Notes are encrypted in the browser with a passphrase only James knows before anything is saved; the repo and the public site only ever hold scrambled text. Class lists with names live only in James's browser, like the GitHub key.
- **Before building this:** check with the principal about the Department's rules on student data. Even encrypted, assessment notes stored outside school systems may not be allowed. If the passphrase is lost, the notes can't be recovered.

## 7. Changes to the hard rules

These need James's agreement before building, and CLAUDE.md is updated to match:

- Planning appears in the navigation.
- Manual entry grows from class ticks to class ticks plus class pulse.
- Student-level notes (if approved) are allowed only encrypted, with names kept only in the browser.

## 8. Build order

1. **Data:** `curriculum.json` (Science and Technologies F to 6), `resources.json`, links for every learning area, and `connections` on units and lessons.
2. **Unit planning:** the Planning page, survey, `plan-unit.yml` with two rounds, pick and mix, draft and approve.
3. **Single lesson planning,** reusing the same steps.
4. **Year map and coverage** (fills in with the Phase 2 import).
5. **Assessment:** hinge questions in the lesson spec, class pulse, comment bank.
6. **Encrypted student notes,** only after the school confirms it's allowed.

## 9. Still to decide

- Counts to confirm: Makey Makey, Spheros.
- Is class pulse worth one more tap per class per lesson?
- Should the comment bank follow the school's report comment style or length? An example comment would help.
- The level labels the school uses in reports (for example "working towards, at, above").
