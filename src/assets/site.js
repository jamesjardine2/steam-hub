// Buttons and links with data-copy put that text on the clipboard.
// Links still open as normal (the CRT button opens the pinned chat).
document.addEventListener("click", (event) => {
  const el = event.target.closest("[data-copy]");
  if (!el) return;
  const status = el.parentElement.querySelector(".copy-status");
  const show = (msg) => { if (status) status.textContent = msg; };
  if (!navigator.clipboard) return show("Copy is not available in this browser.");
  navigator.clipboard.writeText(el.dataset.copy).then(
    () => show("Copied to the clipboard."),
    () => show("Could not copy. Select the text instead.")
  );
});

// Pedagogy at a glance: highlight the column of the lesson you came from.
(() => {
  if (!document.referrer || !document.querySelector(".lens-grid")) return;
  let from;
  try { from = new URL(document.referrer); } catch { return; }
  if (from.origin !== location.origin) return;
  const head = [...document.querySelectorAll(".lens-grid [data-lesson-url]")]
    .find((th) => new URL(th.querySelector("a").href).pathname === from.pathname);
  if (!head) return;
  document.querySelectorAll(`.lens-grid [data-lesson-col="${head.dataset.lessonCol}"]`)
    .forEach((el) => el.classList.add("is-current"));
})();

// Pedagogy icons come from the Tabler webfont. An icon class the font
// does not have shows as ti-tag instead, and its tag id is logged.
(() => {
  const icons = document.querySelectorAll("[data-lens-icon]");
  if (!icons.length || !document.fonts) return;
  document.fonts.ready.then(() => {
    icons.forEach((el) => {
      const glyph = getComputedStyle(el, "::before").content;
      if (glyph && glyph !== "none" && glyph !== "normal" && glyph !== '""') return;
      console.warn(`[steam-hub] pedagogy icon for "${el.dataset.lensIcon}" did not render, using ti-tag`);
      el.className = el.className.replace(/\bti-(?!tag\b)[\w-]+/g, "").trim() + " ti-tag";
    });
  });
})();
