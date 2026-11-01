// Live artefacts: the top and bottom bars stay hidden while presenting
// (VTLM 2.0, Attention and Focus), so students see only the slide.
// - Mouse: a bar shows while the pointer is over its strip (CSS :hover).
// - Touch: the first tap on a hidden bar only shows it, so nothing is
//   pressed by accident; it hides again a few seconds later.
// - The mouse pointer hides when it has not moved for a few seconds.
// Arrow keys change slides without showing anything.
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
})();
