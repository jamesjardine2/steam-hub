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
