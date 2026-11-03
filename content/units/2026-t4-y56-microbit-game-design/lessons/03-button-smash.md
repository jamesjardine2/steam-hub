---
number: 3
title: Button Smash
summary: "A 10 second button smashing game on the micro:bit's own A and B buttons, coded on iPad in the simulator: a score variable and a true or false flag for when the game is running."
lisc:
  intention: To use variables to keep score and to control when our game is running.
  criteria:
    - use a variable to count how many times a button is pressed.
    - use a true or false variable so that presses only count while the game is running.
    - test my game, find a problem, and fix it.
curriculum:
  - VC2TDI6C02
  - VC2TDI6C04
vtlm:
  - Focus the learning
  - Explicit explanation and modelling
  - Scaffold practice
  - Monitor progress
citw:
  - CICs
  - Strategy instruction and modelling
  - Worked examples
sequence:
  - phase: Hook
    time: 5 min
    what: Play the finished game on the projector and take challenges from two students. Share the LISC.
  - phase: Design the algorithm
    time: 7 min
    what: No devices. Build the plain-language steps on the board until someone realises the game needs to know if it is running. Name that a flag.
  - phase: Build in the simulator
    time: 16 min
    what: "Checkpoints: score counts up, B starts a new game, presses stop counting after 10 seconds. No downloading until all three work."
  - phase: Download and play
    time: 8 min
    what: One download each, then smashing. Rotate pairs and keep a class leaderboard.
  - phase: Fairness and debugging
    time: 6 min
    what: Is the game fair? Discuss the cheats and bugs students found, then fix one.
  - phase: Pack up and hook
    time: 3 min
    what: "Thirty second demo: swap the A button block for a Jacdac button. Same game, better button."
resources:
  - micro:bit V2 and battery pack (one per pair)
  - iPads with the micro:bit app (one per pair)
  - Projector for the hook and the algorithm
live:
  - kind: SLIDE
    title: Lesson slides
    note: Hook, algorithm, variables, build steps, leaderboard
    file: 03-slides.html
  - kind: HTML
    title: Build the game
    note: The Button Smash code, block by block
    file: 03-code.html
  - kind: HTML
    title: "Word wall: Frayer model"
    note: variable, flag and bug
    file: 03-frayer.html
  - kind: HTML
    title: Variables in Real Life
    note: "Interactive CIC: video likes, footy scoreboard and wallet. Press V to show the variables"
    file: 03-variables.html
crt_notes: Works for a CRT with the plan PDF. No Jacdac kit is needed, only micro:bits, battery packs and iPads. If Bluetooth will not pair, the whole game can be played in the simulator.
---
Students build a 10 second button smashing game using only the micro:bit's own A and B buttons. The hardware stays familiar so all the thinking goes into the code, and the limits they hit become the reason to bring Jacdac modules back in next lesson.

**Simulator first.** Students code on iPads and download over Bluetooth, which is slow. The whole program is built and tested with the on-screen micro:bit before anyone downloads. Budget **two downloads** per pair: one for the working game, one for an extension.

## The algorithm, in student language

This is what should end up on the board before anyone touches an iPad. Students then turn it into blocks themselves.

- At the start, the score is 0 and the game is not running.
- When B is pressed, set the score back to 0, count down, then set the game to running.
- While the game is running, every press of A adds 1 to the score.
- After 10 seconds, set the game to not running and show the score.

**Key words:** variable, set, change, true or false, flag, event, debug

## Lesson sequence

| Time | Step | What to do and say |
|---|---|---|
| 0 to 5 min | Hook | Play the finished game yourself on the projector. Take challenges from two students. Do not explain the code yet. Share the Learning Intention and Success Criteria. |
| 5 to 12 min | Design the algorithm | Whole class, no devices. Ask: "What does the program actually need to do?" Build the plain-language steps on the board together. Push them until someone realises the program needs to know whether the game is running, otherwise presses count before it starts. Name that a **flag**: a variable that holds true or false instead of a number. |
| 12 to 28 min | Build in the simulator | In pairs. Build the core game and test it entirely with the on-screen micro:bit. Checkpoints on the board: (1) score counts up, (2) B starts a new game with the score at 0, (3) presses stop counting after 10 seconds. No downloading until all three work. |
| 28 to 36 min | Download and play | One download each, then actual smashing. Rotate pairs so everyone gets a turn. Record scores on the board as a class leaderboard. |
| 36 to 42 min | Fairness and debugging | "Is the game fair?" Students will have found the cheats and the bugs. Discuss, then let them fix one. Fast finishers take an extension and use their second download. |
| 42 to 45 min | Pack up and hook | Thirty second demo: swap the A button block for a Jacdac button module. Same game, better button. That is next lesson. |

## The slides that worked (after the first Year 6 class)

The first Year 6 class could build the counter but had no idea how to make the game last 10 seconds or stop counting. The task was missing a start event, so "10 seconds from when?" had no answer. Use these four steps on the slide instead:

- Make **B the START button**: when B is pressed, set score to 0 and show "GO".
- Make the game **STOP by itself** 10 seconds after GO.
- **TEST IT:** can you still score points after TIME has shown?
- **FIX IT:** make presses only count while the game is running.

Hint for the last one: "What does the micro:bit need to **remember** that it doesn't know yet?" Say out loud that the pause block is in Basic, and to clear the screen during play so the score doesn't scroll. Step 3 turns "make presses stop" into a testing task every pair can do, so they see the bug before they fix it.

## Variables refresher (if the class needs it)

Put **set score to 0** and **change score by 1** side by side and ask what the difference is. If three students can explain that one replaces and one adds, move on. If not, run the predictions in the simulator: change by 2? Set to 0 while showing 14? After twenty presses, does score remember all twenty presses or just one number? A variable is a box that holds one thing; putting something new in means the old thing is gone. Then point out the flag: it is a variable too, it just holds yes or no.

## The code

Students build blocks. This JavaScript is for your reference and for projecting if a pair gets stuck (paste it into the JavaScript view, then switch back to Blocks).

```
let score = 0
let playing = false

input.onButtonPressed(Button.B, function () {
    score = 0
    basic.showNumber(3)
    basic.showNumber(2)
    basic.showNumber(1)
    basic.showString("GO")
    basic.clearScreen()
    playing = true
    basic.pause(10000)
    playing = false
    basic.showString("TIME")
    basic.showNumber(score)
})

input.onButtonPressed(Button.A, function () {
    if (playing) {
        score += 1
    }
})
```

**Why it works:** the pause inside the B event does not freeze the whole program. Each event runs on its own, so presses of A still count while B's event is waiting. Tell the class once they ask, because it looks wrong.

| Block drawer | What to find |
|---|---|
| Variables | Make a variable called score and a second one called playing. |
| Input | on button A pressed, on button B pressed. |
| Logic | if then, and the true and false blocks for setting playing. |
| Basic | show number, show string, clear screen, pause. |

## Bugs and cheats they will find

Let students discover these rather than heading them off.

| What happens | Why | What to do |
|---|---|---|
| Holding A down does not rack up points | A press is one event, not the button being down. | Leave it: correct behaviour and a good talk about what an event is. |
| Pressing B mid-game restarts it | Nothing stops the B event running during a game. | Real bug. Wrap the B code in **if not playing**. |
| Score keeps climbing after TIME | playing was never set back to false, or the **if** around the A press is missing. | Real bug: the success criterion in action. |
| Wildly different scores | Technique, not code. Two thumbs beat one finger. | Agree a fair technique as a class, then re-run the leaderboard. |

## Questions to ask while roaming

- What does the micro:bit need to remember that it doesn't know yet?
- What is the difference between set score and change score?
- Can you still score after TIME shows? How would you test that?
- Is your game fair? What would make it fairer?

## Support and extension

- **Support:** give the four algorithm lines as a checklist and build the score counter together first. If a pair can't get the true or false flag, they can use a number variable set to 1 or 0 and check if it equals 1.
- **Extension:**
  1. **High score:** a third variable, shown on the V2 logo touch (not on shake, which triggers while smashing).
  2. **Random game length:** replace the 10 second pause with a random wait between 5 and 15 seconds.
  3. **Two player over radio:** both micro:bits on the same radio group send their scores at the end and show WIN, LOSE or DRAW.

**Key idea to finish on:** A variable remembers one value. The score counts the presses, and a true or false flag remembers whether the game is running, so presses only count at the right time.

## Notes for the teacher

- **Look after the hardware:** set the rule before the first download: board flat on the desk, fingertip taps, no fists and no table banging. The micro:bit's own buttons are small switches and a class of smashers will cost boards. That is also the honest argument for next lesson: a Jacdac button is bigger, sturdier and built to be pressed hard.
- **Scrolling scores:** showing the number on every A press scrolls once the score passes 9 and can drop presses. Clear the screen during play and show the score at the end.
- The interactive **Variables in Real Life** page (Bring up live) makes a good hook or refresher: students play with the screens, then flip the switch to see the variables.

## Curriculum links

- **Digital Technologies VC2TDI6C02:** design and represent algorithms involving multiple alternatives (branching) and iteration.
- **Digital Technologies VC2TDI6C04:** implement algorithms as visual programs involving control structures, variables and input.
