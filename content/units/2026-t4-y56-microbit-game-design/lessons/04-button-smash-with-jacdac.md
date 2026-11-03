---
number: 4
title: Button Smash with Jacdac
summary: "Rebuild Button Smash with the Jacdac extension: a sturdy Jacdac button to smash, the LED ring to show the game, and sounds to make it more fun to play."
lisc:
  intention: To improve a game by adding Jacdac inputs and outputs that make it more fun to play.
  criteria:
    - swap the micro:bit's button for a Jacdac button in my code.
    - add lights and sounds that show the player what is happening.
    - test my game with another pair and explain one improvement.
curriculum:
  - VC2TDI6C03
  - VC2TDI6C04
  - VC2TDE6C01
vtlm:
  - Focus the learning
  - Explicit explanation and modelling
  - Scaffold practice
  - Monitor progress
citw:
  - CICs
  - Worked examples
sequence:
  - phase: Hook (CIC)
    time: 5 min
    what: "Smash last week's game on the micro:bit's tiny A button, then on a Jacdac button. \"Which would you rather smash? How could the game tell you what is happening?\""
  - phase: Model the swap
    time: 7 min
    what: "Open last week's project, add the Jacdac blocks, and swap on button A pressed for on button down. Test in the simulator."
  - phase: Make it better
    time: 15 min
    what: Pairs add at least one light and one sound from the menu on the board. Simulator first.
  - phase: Download and play
    time: 8 min
    what: Download, then swap with another pair and play each other's games.
  - phase: Share
    time: 5 min
    what: "Two pairs explain one improvement: \"We added ___ so the player knows ___.\""
  - phase: Pack up
    time: 5 min
    what: Kit back in the tray against the diagram, battery packs off.
resources:
  - One kit tray per pair (micro:bit V2, Jacdapter, Jacdac button, 8 pixel LED ring, cables, battery pack)
  - One iPad per pair with the micro:bit app and last week's Button Smash project
  - Make it better menu on the board (below)
live:
  - kind: SLIDE
    title: Lesson slides
    note: Hook, the swap, make it better, share
    file: 04-slides.html
  - kind: HTML
    title: Swap and add feedback
    note: The swap, then lights, sound and the score ring
    file: 04-code.html
  - kind: HTML
    title: "Word wall: Frayer model"
    note: feedback and user
    file: 04-frayer.html
crt_notes: Needs the Jacdac kits and the projects from Lesson 3, so it is best taught by James. A CRT can run the Pet Hamster backup lesson instead.
---
Last week's Button Smash used the micro:bit's own A and B buttons. This week the same game moves onto Jacdac: a big sturdy button to smash, the LED ring to show what is happening, and sound. Students already know how to add the Jacdac extension and module blocks from Lesson 2, so the swap takes minutes and the rest of the lesson goes into making the game more fun to play.

Pairs reopen their own Button Smash project (My Programs in the app). Anyone who lost theirs starts from the Lesson 3 code. **Simulator first**, as always.

## The swap

1. Open your Button Smash project. Tap **Extensions**, search **jacdac** and add it (if it is not there already).
2. Tap **+** next to **Simulators** and add a **button** and the **LED ring 8 pixels**, then tap **ADD BLOCKS**.
3. In **Modules**, drag out **on button down**. Move everything from inside **on button A pressed** into it, then delete the old A block.
4. Keep **B** on the micro:bit as the start button for now (or use a second Jacdac button for start if your kit has one).
5. Test in the simulator: tap the Jacdac button in the simulator during a game. Does the score still count?

## Make it better: lights and sounds menu

Pairs choose **at least one light and one sound**, then more if they have time. Each one should tell the player something.

| Idea | Blocks | What it tells the player |
|---|---|---|
| Green for GO, red for TIME | **set led all to** green after GO, red after TIME | When to start and stop smashing |
| Score on the ring | **plot led bar graph of** score inside the button event | How well you are going, like a fuel gauge |
| A click on every press | a short tone or sound from **Music** inside the button event | Your press counted |
| Countdown beeps | a tone with each 3, 2, 1 | Get ready |
| Winning tune | a melody from **Music** after TIME | The game is over |
| Spinning finish | **rotate led pixels by 1** in a short loop after TIME | Game over, in style |

**Key words:** input, output, feedback, user, improve

## Lesson sequence

| Time | Step | What to do and say |
|---|---|---|
| 0 to 5 min | Hook (CIC) | Play last week's game on the micro:bit's small A button, then hold up a Jacdac button and smash it. Ask: "Which would you rather smash? And when you're playing, how do you know the game has started, or that your press counted?" Share the LISC. |
| 5 to 12 min | Model the swap | On the projected iPad, open last week's project and do the swap (steps 1 to 5 above), thinking aloud. Point out that the code inside the event did not change at all, only the event block. Then show the menu. |
| 12 to 27 min | Make it better | Pairs do the swap, then add at least one light and one sound. Test every change in the simulator. Roam with the questions below. |
| 27 to 35 min | Download and play | Each pair downloads once (RESET three times, check the pattern). Then swap with another pair: play their game without being told how, and say one thing that helped. |
| 35 to 40 min | Share | Two or three pairs explain one improvement using the stem on the board. |
| 40 to 45 min | Pack up | Unplug the cables from the modules, micro:bit out of the Jacdapter, battery pack off, everything back in the tray. Check against the labelled diagram. |

## Write this on the board

Sentence stem: **We added ___ so the player knows ___.**

## Questions to ask while roaming

- What changed in your code when you swapped buttons? What stayed the same?
- How does the player know the game has started? That it has finished?
- Does your sound play on every press? Does that slow the game down?
- Which of your lights or sounds is the most useful to the player? Why?

## Support and extension

- **Support:** do the swap together first, then add one thing: green for GO and red for TIME.
- **Extension:**
  - **Two-player smash:** plug in a second Jacdac button and give each player a score. Who wins?
  - **Best score:** keep a best score and flash the ring rainbow when it is beaten.
  - **Speed meter:** light more pixels the faster you are smashing.

**Key idea to finish on:** The same code works with a new input, because the code inside the event stayed the same. Outputs like lights and sounds give the player feedback, which makes a game easier and more fun to play.

## Notes for the teacher

- **Module names differ** between iPads (button1, button8, led4). Use whatever yours says.
- **Brightness:** the ring starts at 0.05. If it looks dim, **set led brightness to** 0.2 or 0.3. Full brightness drains the battery.
- **Sounds that play until done** pause the code, which can drop presses. If a pair's score stops counting during a sound, swap to a short tone or a sound that plays in the background.
- **Downloads:** budget one, plus one for an extension.
- This lesson's "play without being told how" moment is a small preview of the silent user test in Lessons 5 and 6.

## Curriculum links

- **Digital Technologies VC2TDI6C03:** design and modify a user interface for a digital system, and generate, communicate and evaluate the designs.
- **Digital Technologies VC2TDI6C04:** implement algorithms as visual programs involving control structures, variables and input.
- **Design and Technologies VC2TDE6C01:** explain how electrical energy can be transformed into movement, sound or light in a product or system.
