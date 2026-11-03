---
number: 5
title: "Reaction Game: Code, Play and Plan"
summary: "Code the Jacdac reaction game (or reopen Button Smash), play it like a new player, turn the problems into class design criteria, then sketch a control panel."
lisc:
  intention: To find the problems players have with our game and plan a control panel that solves them.
  criteria:
    - connect and run my game code.
    - identify problems a new player has when using the game.
    - sketch a control panel layout and explain why I put each part where I did.
curriculum:
  - VC2TDI6C01
  - VC2TDI6C03
  - VC2TDI6C04
  - VC2TDE6D02
  - VC2TDE6D04
vtlm:
  - Focus the learning
  - Explicit explanation and modelling
  - Scaffold practice
  - Monitor progress
citw:
  - CICs
  - Worked examples
sequence:
  - phase: Hook
    time: 5 min
    what: "Explain the Reaction Game with a kit in hand: press one button to start, wait for green, hit the other as fast as you can. Introduce the design brief and the choice of game."
  - phase: Get the game running
    time: 12 min
    what: Reaction Game pairs build or load the code. Button Smash pairs reopen their project and can add a second Jacdac button.
  - phase: Play and notice
    time: 7 min
    what: "\"Would a Prep student know how to play this?\" Pairs list every moment they were confused or made a mistake."
  - phase: Build criteria together
    time: 5 min
    what: Turn the problems into 3 or 4 class design criteria, about the player, not looks.
  - phase: Sketch two layouts
    time: 11 min
    what: Two annotated panel sketches in the journal, showing why each part sits where it does.
  - phase: Choose and justify
    time: 5 min
    what: Circle one layout and link it to a criterion in one sentence. Pack kits away.
resources:
  - "Jacdac kit per pair: micro:bit, 2 Jacdac buttons, 8 pixel LED ring, cables, battery pack"
  - iPads with the micro:bit app
  - STEAM journals
  - Level up challenge cards (printed or displayed; in the plan PDF)
live:
  - kind: SLIDE
    title: Lesson slides
    note: The game, design brief, criteria and planning
    file: 05-slides.html
  - kind: HTML
    title: The reaction game
    note: How it plays, then the code
    file: 05-code.html
  - kind: HTML
    title: "Word wall: Frayer model"
    note: criteria, interface and prototype
    file: 05-frayer.html
crt_notes: Best taught by James, because the design criteria are co-constructed with the class and carry into Lesson 6. A CRT can run the Pet Hamster backup lesson instead.
---
Lessons 5 and 6 turn the unit into a design task. Students design, build and test a **control panel** that lets a brand new player use a micro:bit and Jacdac game without being told how. The focus is the **user**, not decoration. Because the task includes repeated user testing and optional level up challenges, there is no natural finish line for fast finishers.

**Design brief:** Design a control panel so that someone who has never played the game (a Prep student, a parent at open day) can work it out without being told.

**Student choice:** each pair designs a panel for either the new **Reaction Game** or their own **Button Smash** game. Same brief, same criteria. Pairs who loved Button Smash get to keep building on their own work.

## Lesson sequence

| Time | Step | What to do and say |
|---|---|---|
| 0 to 5 min | Hook | Hold up a Jacdac kit and explain the Reaction Game: press one button to start, wait for green, hit the other button as fast as you can. Introduce the design brief and the choice of game. Keep it brief: students discover the design problems themselves once they play. |
| 5 to 17 min | Get the game running | Reaction Game pairs build or load the code (below). Button Smash pairs reopen their project and add a second Jacdac button if they want one. Students press each button while watching the simulator to find out which is button1 and which is button2. |
| 17 to 24 min | Play and notice | Pairs play, then ask: "Would a Prep student know how to play this?" They list in their journal every moment they were confused or made a mistake. Point out that the two buttons look identical: that confusion is the design problem. Prompt: "Where did your eyes go? Could you read the score?" |
| 24 to 29 min | Build criteria together | Pairs share problems. Turn them into 3 or 4 class design criteria and record them on the board. Keep them about the player, not about looks. |
| 29 to 40 min | Sketch two layouts | In the journal, annotated with why each part sits where it does. Fast finishers pick up a level up card and think about how it would change their layout. |
| 40 to 45 min | Choose and justify | Circle one layout and write one sentence linking it to a criterion. Pack kits away. Check one justification per pair as an exit check. |

## Design criteria

Co-construct these with the class. A quick test for any criterion: could we check it by watching someone play silently?

| Kind of problem | Example criteria |
|---|---|
| Knowing what to do | A new player can tell which button starts the game. A new player knows what to do when the ring turns green. A new player can play without anyone explaining it. |
| Not making mistakes | The start button and the reaction button can't be mixed up. The player can't press start by accident. The buttons are easy to find without looking down. |
| Seeing and reacting | The player can see the ring and reach the button at the same time. The ring is the first thing the player's eyes go to. The score is easy to read without moving the panel. |
| Fairness and comfort | The panel works for left and right handed players, and for a younger or smaller player. The panel stays still when the button is hit hard. |

**Weak and strong criteria** (worth modelling, because first attempts are usually about looks or too vague to test):

| Weak | Why | Stronger |
|---|---|---|
| It looks cool. | About looks, not the player | A new player notices the ring straight away. |
| It's easy to use. | Too vague to test | A new player can start a game without asking. |
| The buttons are good. | Can't be measured | The two buttons can't be confused with each other. |

## Reaction Game code

Paste into the JavaScript view in MakeCode, then switch to Blocks. Add the Jacdac button and Jacdac LED extensions first (module names may differ on each iPad).

```
let startTime = 0
let reactionTime = 0
let canPress = false

// Press the start button to begin
modules.button2.onEvent(jacdac.ButtonEvent.Down, function () {
    basic.clearScreen()
    modules.led1.setAll(0x000000)
    basic.pause(randint(1000, 5000))
    modules.led1.setAll(0x00ff00)
    startTime = input.runningTime()
    canPress = true
})

// Press the reaction button when the ring turns green
modules.button1.onEvent(jacdac.ButtonEvent.Down, function () {
    if (canPress) {
        canPress = false
        reactionTime = input.runningTime() - startTime
        basic.showNumber(reactionTime)
    }
})
```

The random pause stops players guessing when the light will change, and **canPress** works like the playing flag in Button Smash: presses only count at the right time.

## Level up challenges

These keep fast finishers working and push them back into the code. Each one changes what the panel needs to communicate, so the design changes too.

| Challenge | Code change | Panel change |
|---|---|---|
| Too early | Pressing before green turns the ring red. Add an else to the reaction button's if block. | How will a new player know the rule? Add a warning or instruction. |
| Best time | Make a bestTime variable and update it when a new time is faster. | Where does the best time appear, and how does the player see it? |
| Speed ring | Light more pixels for faster times using set led color at pixel. | Add a key so the player understands what the ring means. |
| Two player | Add a third button. The first player to press after green wins. | Redesign for fairness: equal distance, clear player sides. |

## Questions to ask while roaming

- Would a Prep student know which button to press first?
- Where did your eyes go when the light changed? Could you reach the button at the same time?
- Which problem does that part of your sketch solve?
- Which criterion is your layout strongest on?

## Support and extension

- **Support:** give pairs the Reaction Game code to load rather than build, so the lesson time goes into playing and planning.
- **Extension:** a level up card, and how it changes the layout.

**Key idea to finish on:** Good design starts with the user. We watch where players get confused, turn those problems into criteria, and plan a design that fixes them.

## Notes for the teacher

- The two Jacdac buttons look identical. That confusion is the design problem, so don't solve it for students.
- Keep criteria about the player, not decoration.
- Journals carry into Lesson 6: the class criteria stay on the board or get photographed.

## Curriculum links

- **Digital Technologies VC2TDI6C01:** define problems with teacher-provided or co-developed functional requirements.
- **Digital Technologies VC2TDI6C03:** design and modify a user interface for a digital system, and generate, communicate and evaluate the designs.
- **Digital Technologies VC2TDI6C04:** implement algorithms as visual programs involving control structures, variables and input.
- **Design and Technologies VC2TDE6D02:** generate, iterate and communicate design ideas, decisions and processes using technical terms and graphical representation techniques.
- **Design and Technologies VC2TDE6D04:** negotiate design criteria that address ethical considerations, including sustainability, to evaluate design ideas, processes and solutions.
