---
number: 2
title: Intro to Jacdac
summary: "Connect a Jacdac button and LED ring, add the Jacdac extension in the micro:bit iPad app, then code the ring to light up when the button is pressed."
lisc:
  intention: To connect Jacdac modules to a micro:bit and code them so a button press makes a light turn on.
  criteria:
    - connect a Jacdac button and LED ring to my micro:bit using the Jacdapter.
    - add the jacdac extension and the blocks for my modules in MakeCode.
    - code my micro:bit so pressing the button lights up the LED ring.
    - send my code to the micro:bit from the iPad and test that it works.
curriculum:
  - VC2TDI6S01
  - VC2TDI6S02
  - VC2TDI6C04
vtlm:
  - Focus the learning
  - Explicit explanation and modelling
  - Scaffold practice
  - Monitor progress
citw:
  - CICs
  - Worked examples
pedagogy:
  citw.interest_cues:
    level: focus
    how: "'Neither of these has a battery, a screen or a brain. How could the micro:bit know which one is which?'"
  vtlm.explicit.scaffold:
    level: focus
    how: "Pairs follow the 15-step iPad setup handout, swapping roles at step 8, with a checkpoint at step 10."
  vtlm.explicit.monitor:
    level: present
    how: "The step 10 checkpoint, and thumbs for each Success Criterion at the end."
  citw.peer_consolidation:
    level: present
    how: "In Break it on purpose, each student changes one thing to surprise their partner: 'What else could a press mean?'"
  pcms.2:
    level: present
    how: "The tray rule, and the kit goes back in the tray against the labelled diagram."
  vc.digitech:
    level: focus
    how: "Pairs connect a Jacdac button (input) and LED ring (output) to the micro:bit and code them (VC2TDI6S01, VC2TDI6S02, VC2TDI6C04)."
sequence:
  - phase: Hook (CIC)
    time: 5 min
    what: "\"Neither of these has a battery, a screen or a brain. How could the micro:bit know which one is which?\""
  - phase: Kit tour
    time: 5 min
    what: Name each part on the labelled diagram. Input (button) and output (ring). Tray rule.
  - phase: Build the hardware
    time: 4 min
    what: Pairs assemble the kit and press the button. Nothing happens. Hardware needs code.
  - phase: Handout steps 1 to 15
    time: 18 min
    what: Pairs follow the iPad setup handout, swapping roles at step 8, with a checkpoint at step 10.
  - phase: Break it on purpose
    time: 6 min
    what: Change one thing to surprise your partner. "What else could a press mean?"
  - phase: Pack up, reflect and cliffhanger
    time: 7 min
    what: Kit back in the tray against the diagram. Thumbs for each criterion. "How could we make it remember?"
resources:
  - text: Jacdac iPad setup handout (one per pair)
    file: 02-ipad-setup-handout.pdf
  - One kit tray per pair (micro:bit V2, Jacdapter, Jacdac button, 8 pixel LED ring, 2 Jacdac cables, battery pack)
  - One iPad per pair with the micro:bit app and Bluetooth on
  - Labelled kit diagram on the board, and your own assembled kit for demonstrating
live:
  - kind: SLIDE
    title: Lesson slides
    note: Hook, kit tour, LISC, rules and cliffhanger
    file: 02-slides.html
  - kind: HTML
    title: Connect and light up
    note: "Animated steps: hardware, extension, code"
    file: 02-jacdac.html
  - kind: HTML
    title: "Word wall: Frayer model"
    note: module, extension and pixel
    file: 02-frayer.html
  - kind: LINK
    title: Jacdac iPad setup handout
    note: 15 steps with screenshots, from the app to a lit ring
    file: 02-ipad-setup-handout.pdf
crt_notes: Needs the kit trays checked beforehand (all six parts and fresh batteries), so it is best taught by James. A CRT can run the Pet Hamster backup lesson instead.
---
**Before the lesson:** check every tray has all six parts and fresh batteries in the pack. Make sure the micro:bit app is on each iPad and Bluetooth is switched on. Run steps 12 to 15 of the handout once yourself so you know what the pairing screens look like in your room.

Students work in pairs: one kit tray, one iPad and one printed copy of the iPad setup handout per pair.

## Lesson sequence

| Time | Step | What to do and say |
|---|---|---|
| 0 to 5 min | Hook (CIC) | Hold up the button and the ring and ask: "Neither of these has a battery, a screen or a brain. How could the micro:bit know which one is which?" Take guesses but don't answer yet. Then ask where students have pressed a button today that made a light come on (pedestrian crossing, lift, microwave). Share the LISC. |
| 5 to 10 min | Kit tour | Put the labelled diagram up and name each part. Draw out the input and output idea: the button gives the micro:bit information, and the ring does something. Show on your kit how the micro:bit slots into the Jacdapter, how the cables click in, and where the battery pack connects. Set the tray rule: parts live in the tray, not on the table. |
| 10 to 14 min | Build the hardware | Pairs assemble their kit using the "Before you start" photo on the handout. Once it is powered, ask them to press the button. Nothing happens. Ask: "Is it broken? What's missing?" Land on the answer that hardware does nothing until code tells it what a press means. |
| 14 to 32 min | Handout steps 1 to 15 | Pairs work through the handout. One partner taps and the other reads, and they swap roles at step 8. Before they tap the simulated button in step 12, each pair predicts what will happen. Checkpoint at step 10: pairs hold up their tray when ADD BLOCKS is done, so you can spot anyone stuck before the coding step. At step 14, point out that the pattern is different on every micro:bit and ask why the iPad checks it ("so it doesn't send my code to someone else's"). |
| 32 to 38 min | Break it on purpose | Pairs with a working ring change one thing to surprise their partner: a different colour, light on button up instead of down, or a second block so it flashes. Then ask the class: "Your code says button means light. What else could a press mean?" |
| 38 to 42 min | Pack up | Unplug the cables from the modules, take the micro:bit out of the Jacdapter, switch off the battery pack, and put everything back in the tray. Pairs check their tray against the labelled diagram before it is collected. |
| 42 to 45 min | Reflect and cliffhanger | Thumbs against each success criterion. Close with: "Next lesson the micro:bit has to remember how many times you pressed. Right now it forgets every press instantly. How could we make it remember?" |

## The handout steps

1. Open the micro:bit app. 2. Tap **Create Code**. 3. Start a **New Project** (name it jacdac). 4. Tap **Extensions**. 5. Search **jacdac** and add it: a green **Modules** category appears. 6. Tap **+** next to **Simulators**. 7. Choose **button**. 8. Tap **+** again. 9. Choose **LED ring 8 pixels**. 10. Tap **ADD BLOCKS**. 11. In Modules, drag out **on button down** and put **set led all to** inside it, then pick a colour. 12. Test in the simulator, then tap **Download**. 13. Press **RESET** three times, then **Continue**. 14. Check the pattern matches your micro:bit. 15. Press your real Jacdac button: the ring lights up.

## Challenge ideas

- **Warm-ups:** make the ring turn off when you let go (check the button block's dropdown); pick a colour (sports team, school colours); light the ring and show an icon at the same time; add a sound from Music (one input, two outputs).
- **Getting trickier:** flash three times (pause between on and off); traffic light (green, yellow, red with pauses); long press does something different; the micro:bit's own A button turns the ring blue and the Jacdac button turns it red.
- **Spicy (sneak peek at next lesson):** each press lights one more pixel until all 8 are lit (the micro:bit has to remember how many presses); design your own one-input, one-output gadget and explain it to another pair.

## The LED ring blocks

- **set led brightness to** runs from 0 (off) to 1 (full). It starts at 0.05 on purpose: the LEDs are very bright up close and full brightness drains the battery. Try 0.2 or 0.3 if the ring seems dim.
- **set led all to** makes every light the same colour (the handout block).
- **set led color at pixel** lights just one of the 8 lights.
- **shift led pixels** slides every colour one place (the end one falls off); **rotate led pixels** does the same but wraps around.
- **plot led bar graph** lights part of the ring to show a number, like a fuel gauge.
- **Rainbow:** there is no ready-made rainbow. Give pixels 0 to 7 a colour each in on start, then **rotate led pixels by 1** with a short pause in forever.
- **Pixels** are numbered **0 to 7**, not 1 to 8, because computers start counting at 0. Students often try pixel 8 and wonder why nothing happens.

## Support and extension

- **Support:** pair a hesitant student with a confident reader, or complete steps 1 to 5 in advance on a few iPads so those pairs start at the simulator step.
- **Extension:** the challenge ideas above, from warm-ups to spicy.

## Notes for the teacher

- **Pairing:** if a micro:bit won't pair, press RESET three times again and check the battery pack is switched on.
- **Wrong micro:bit:** with many micro:bits in one room, a pair can connect to their neighbour's. The pattern check in step 14 is the safeguard, so make sure no one skips it.
- **Blocks not snapping:** some pairs think **set led** is inside the green block when it is only sitting next to it. Ask them to drag the green block and see whether the set led block moves with it.
- **Different names:** module names like button8 and led4 differ between iPads. That is just the name MakeCode gave the module; use whatever yours says.
- **Ring not lighting:** the ring only lights when code tells it to. Check every cable has clicked in, the battery pack is on, and the block is inside the button block.

## Curriculum links

- **Digital Technologies VC2TDI6S01:** investigate the main internal components of common digital systems and their function.
- **Digital Technologies VC2TDI6S02:** examine how digital systems form networks to transmit data (Jacdac modules talk to the micro:bit over one cable).
- **Digital Technologies VC2TDI6C04:** implement algorithms as visual programs involving control structures, variables and input.
