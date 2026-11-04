// Live artefacts: the top and bottom bars stay hidden while presenting
// (VTLM 2.0, Attention and Focus), so students see only the slide.
// - Mouse: a bar shows while the pointer is over its strip (CSS :hover).
// - Touch: the first tap on a hidden bar only shows it, so nothing is
//   pressed by accident; it hides again a few seconds later.
// - The mouse pointer hides when it has not moved for a few seconds.
// Arrow keys change slides without showing anything.
//
// Steps inside a slide: a word wall or how-to shown in the lesson slides
// sets window.liveSteps (see below). The arrow keys, Page keys, Space and
// the deck's Back and Next then go through its steps first, and only move
// to the next slide after the last one. Coming back into the slide lands
// on its last step. A row of small dots shows for a moment after each
// step, so the teacher can see how far through it is.
(() => {
  const root = document.documentElement;

  let idle = 0;
  const moved = () => {
    root.classList.remove("idle");
    clearTimeout(idle);
    idle = setTimeout(() => root.classList.add("idle"), 2500);
  };
  addEventListener("pointermove", moved, { passive: true });
  moved();

  // Not every browser says on a click what pressed it, so note it here.
  let pressedWith = "mouse";
  addEventListener("pointerdown", (e) => { pressedWith = e.pointerType; }, true);

  let shown = 0;
  addEventListener("click", (e) => {
    const bar = e.target.closest("header, footer");
    if (!bar || pressedWith === "mouse") return;
    if (!root.classList.contains("bars")) {
      e.preventDefault();
      e.stopPropagation();
    }
    root.classList.add("bars");
    clearTimeout(shown);
    shown = setTimeout(() => root.classList.remove("bars"), 5000);
  }, true);

  // A page with steps sets window.liveSteps to one of these:
  //   { kind: "steps", count, at: () => current, go }
  //   { kind: "words", count, at: () => current, show }   (Frayer: each
  //     Right uncovers the next box, then moves to the next word)
  const stepperOf = (win) => {
    let s;
    try { s = win && win.liveSteps; } catch { return null; }
    if (!s) return null;
    const doc = win.document;
    const covers = () => [...doc.querySelectorAll(".cover")];
    if (s.kind === "words") {
      const uncoverAll = () => covers().forEach((c) => { c.hidden = true; });
      return {
        where: () => [s.at(), s.count],
        next() {
          const c = covers().find((x) => !x.hidden);
          if (c) { c.hidden = true; return true; }
          if (s.at() < s.count - 1) { s.show(s.at() + 1); return true; }
          return false;
        },
        back() {
          const open = covers().filter((x) => x.hidden);
          if (open.length) { open[open.length - 1].hidden = false; return true; }
          if (s.at() > 0) { s.show(s.at() - 1); uncoverAll(); return true; }
          return false;
        },
        first: () => s.show(0),
        last() { s.show(s.count - 1); uncoverAll(); },
      };
    }
    return {
      where: () => [s.at(), s.count],
      next() { if (s.at() >= s.count - 1) return false; s.go(s.at() + 1); return true; },
      back() { if (s.at() <= 0) return false; s.go(s.at() - 1); return true; },
      first: () => s.go(0),
      last: () => s.go(s.count - 1),
    };
  };

  const NEXT = ["ArrowRight", "PageDown", " "];
  const BACK = ["ArrowLeft", "PageUp"];
  const typing = (el) => el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName));

  // Inside the lesson slides: handle the page's own steps, and hand
  // everything else to the deck, so keys work wherever the focus is.
  if (parent !== window && root.classList.contains("embed")) {
    addEventListener("keydown", (e) => {
      if (typing(e.target) || e.ctrlKey || e.metaKey || e.altKey) return;
      const dir = NEXT.includes(e.key) ? "next" : BACK.includes(e.key) ? "back" : null;
      if (!dir) return;
      const own = stepperOf(window);
      // Space keeps its own job (for example play and pause) on pages without steps.
      if (!own && e.key === " ") return;
      e.preventDefault();
      e.stopImmediatePropagation();
      try { parent.dispatchEvent(new CustomEvent("live-step", { detail: dir })); } catch {}
    }, true);
    return;
  }

  const stage = document.querySelector(".stage.deck");
  if (!stage) return;
  const frame = () => {
    const f = stage.querySelector(".slide.frame:not([hidden]) iframe");
    return f ? stepperOf(f.contentWindow) : null;
  };

  const pips = document.createElement("div");
  pips.className = "substeps";
  pips.setAttribute("aria-hidden", "true");
  stage.appendChild(pips);
  let fade = 0;
  const showPips = (st) => {
    const [i, n] = st.where();
    if (n < 2) return;
    pips.innerHTML = Array.from({ length: n }, (_, j) => `<span${j === i ? ' class="on"' : ""}></span>`).join("");
    pips.classList.add("show");
    clearTimeout(fade);
    fade = setTimeout(() => pips.classList.remove("show"), 1600);
  };

  // Returns true when the step happened inside the slide.
  const step = (dir) => {
    const st = frame();
    if (st && st[dir]()) { showPips(st); return true; }
    // The deck moves on; a slide with steps starts at the right end.
    const was = stage.querySelector(".slide:not([hidden])");
    setTimeout(() => {
      if (stage.querySelector(".slide:not([hidden])") === was) return;
      pips.classList.remove("show");
      const into = frame();
      if (!into) return;
      into[dir === "next" ? "first" : "last"]();
      showPips(into);
    });
    return false;
  };
  const deckKey = (key) => document.dispatchEvent(new KeyboardEvent("keydown", { key }));
  let passing = false;

  addEventListener("keydown", (e) => {
    if (passing || typing(e.target) || e.ctrlKey || e.metaKey || e.altKey) return;
    const dir = NEXT.includes(e.key) ? "next" : BACK.includes(e.key) ? "back" : null;
    if (dir && step(dir)) { e.preventDefault(); e.stopImmediatePropagation(); }
  }, true);

  // Keys pressed while the focus is inside an embedded page.
  addEventListener("live-step", (e) => {
    if (step(e.detail)) return;
    passing = true;
    deckKey(e.detail === "next" ? "ArrowRight" : "ArrowLeft");
    passing = false;
  });

  // The deck's own Back and Next buttons step the same way.
  addEventListener("click", (e) => {
    const b = e.target.closest("footer #next, footer #back");
    if (!b || !stage.contains(b)) return;
    if (step(b.id)) { e.preventDefault(); e.stopImmediatePropagation(); }
  }, true);
})();
