// Live artefacts: hide the top and bottom bars while presenting (VTLM 2.0,
// Attention and Focus), so students see only the slide. Moving the mouse
// or touching the screen brings the bars back; they fade again after a few
// quiet seconds. Arrow keys still change slides without showing them.
(() => {
  const root = document.documentElement;
  let timer = 0;
  const wake = () => {
    root.classList.remove("quiet");
    clearTimeout(timer);
    timer = setTimeout(() => {
      // Stay visible while the pointer rests on a bar.
      if (!document.querySelector("header:hover, footer:hover")) root.classList.add("quiet");
      else wake();
    }, 3000);
  };
  addEventListener("pointermove", wake, { passive: true });
  addEventListener("pointerdown", wake, { passive: true });
  addEventListener("focusin", (e) => { if (e.target.closest("header, footer")) wake(); });
  wake();
})();
