---
number: 1
title: Meet the micro:bit
summary: "Year 5: what is a micro:bit? Year 6: micro:bit refresher. Inputs and outputs, the iPad app, simulator first, then a first download over Bluetooth."
lisc:
  intention: To learn what a micro:bit can sense and do, and how to code it from the iPad app.
  criteria:
    - name the micro:bit's inputs and outputs.
    - code and test a program in the simulator.
    - send my code to the micro:bit over Bluetooth.
curriculum:
  - VC2TDI6S01
  - VC2TDI6C04
vtlm:
  - Focus the learning
  - Explicit explanation and modelling
  - Scaffold practice
  - Monitor progress
citw:
  - CICs
  - Vocabulary
  - Worked examples
sequence:
  - phase: Hook (CIC)
    time: 5 min
    what: "Hold up a micro:bit: \"This is a tiny computer. What do you think it can sense? What can it do?\""
  - phase: Inputs and outputs
    time: 8 min
    what: Tour the board (buttons, logo, sensors, display, speaker). Sort them into inputs and outputs on the board.
  - phase: Model the app
    time: 5 min
    what: "Show Create Code, a new project, one event block, test in the simulator. Simulator first."
  - phase: Code in pairs
    time: 15 min
    what: "Year 5: a tutorial (Flashing Heart, then Smiley Buttons). Year 6: the refresher challenge card."
  - phase: First download
    time: 7 min
    what: "One download per pair: RESET three times, check the pattern, test on the real micro:bit."
  - phase: Share and pack up
    time: 5 min
    what: Two pairs show their code. Name one input and one output. Battery packs unplugged, tubs counted.
resources:
  - micro:bit V2 and battery pack (one per pair)
  - iPads with the micro:bit app (one per pair)
  - STEAM journals
live:
  - kind: SLIDE
    title: Lesson slides
    note: Hook, inputs and outputs, LISC, Year 6 challenge
    file: 01-slides.html
  - kind: HTML
    title: Code, test, download
    note: "Animated steps: the app, the simulator and Bluetooth"
    file: 01-app.html
  - kind: HTML
    title: "Word wall: Frayer model"
    note: input, output and event
    file: 01-frayer.html
crt_notes: "Works for a CRT as written. If Bluetooth will not pair, skip the download: everything can be tested in the simulator. The Pet Hamster lesson (Files and links on the unit page) is a ready-made CRT backup."
---
This lesson starts the unit for both year levels. **Year 5** meet the micro:bit for the first time this year (**What is a micro:bit?**). **Year 6** have used it before, so theirs is a **micro:bit refresher** that moves faster and ends with a challenge. The hook, the inputs and outputs talk, the app demonstration and the download routine are the same for both.

Students work in pairs with one iPad, one micro:bit V2 and one battery pack. The class habit from today, used all unit: **simulator first**, download only when it works.

## Inputs and outputs

| Part | Input or output | What it does |
|---|---|---|
| Buttons A and B | Input | Pressed by the player |
| Gold logo (V2) | Input | Senses a touch |
| Accelerometer | Input | Senses shake and tilt |
| Microphone (V2) | Input | Senses loud and quiet sounds |
| Light sensing | Input | The LED display can sense light levels |
| 5 by 5 LED display | Output | Shows icons, numbers and words |
| Speaker (V2) | Output | Plays tones, melodies and sounds |
| Radio | Input and output | Sends and receives messages between micro:bits |

**Key words:** input, output, event, simulator, download, Bluetooth

## Lesson sequence

| Time | Step | What to do and say |
|---|---|---|
| 0 to 5 min | Hook (CIC) | Hold up a micro:bit. Ask: "This is a tiny computer, smaller than a phone. What do you think it can sense? What can it do?" Take ideas from several pairs. Read the Learning Intention and Success Criteria. |
| 5 to 13 min | Inputs and outputs | Project a micro:bit (or hold one under the visualiser) and point to each part. Draw two columns on the board, **Inputs** (the micro:bit senses) and **Outputs** (the micro:bit does), and sort each part with the class. Year 6: ask them to name the parts before you do, then add the ones they missed. |
| 13 to 18 min | Model the app | On the projected iPad: open the micro:bit app, tap **Create Code**, start a **New Project**. Drag **on button A pressed** from Input and put **show icon** from Basic inside it. Tap A on the simulator. Say: "The code waits for an event, then runs what is inside it." Set the rule: **simulator first**. |
| 18 to 33 min | Code in pairs | **Year 5:** open the **Flashing Heart** tutorial (Create Code, then Tutorials), then **Smiley Buttons** if there is time. **Year 6:** refresher challenge card (below). Both: test every change in the simulator. Roam with the questions below. |
| 33 to 40 min | First download | Model once: tap **Download**, press **RESET** on the back of the micro:bit **three times**, check the pattern on the screen matches the micro:bit, tap **Continue**. Each pair downloads once and tests on the real micro:bit. |
| 40 to 45 min | Share and pack up | Two pairs show their code. Each names one input and one output they used. Pack up: battery packs unplugged, micro:bits back in the tub, count against the tub number. |

## Year 6 refresher challenge

Build one program that uses **three different inputs**, each with a different output:

1. Button A shows a happy face.
2. Button B plays a sound (Music).
3. Shake (or the gold logo) shows a number or a word.

Then: can you make the micro:bit go back to a "waiting" face after each one?

## Questions to ask while roaming

- Point to the block that is waiting for an input. What is it waiting for?
- Is the speaker an input or an output? How do you know?
- What happens if you put two blocks inside the event? Predict, then test it.
- Why test in the simulator before downloading?

## Support and extension

- **Support:** Year 5 pairs follow the tutorial step by step; success is one working event tested in the simulator. Colour match the blocks to the menus (Basic is blue, Input is pink, Music is orange).
- **Extension:** add a second event that uses a different input, or use **on logo pressed** so the micro:bit reacts to a touch. Year 6: make a "waiting" face appear after every reaction.

**Key idea to finish on:** A micro:bit is a small computer. Inputs let it sense what is happening, outputs let it do something, and an event block runs its code when the input happens.

## Notes for the teacher

- **Bluetooth pairing:** press RESET three times so the micro:bit shows the pairing pattern. Make sure the pattern on the iPad matches the micro:bit, so code does not go to a neighbour's board.
- **Downloads are slow:** budget one per pair this lesson. Everything else is tested in the simulator.
- **Battery packs:** unplug them at pack up so they do not run flat between classes.
- This lesson sets up Lesson 2, where the micro:bit plugs into the Jacdac adapter.

## Curriculum links

- **Digital Technologies VC2TDI6S01:** investigate the main internal components of common digital systems and their function.
- **Digital Technologies VC2TDI6C04:** implement algorithms as visual programs involving control structures, variables and input.
