// Light or dark mode, remembered on this device. Loaded in <head> so the
// page draws in the right mode straight away. The hub and the live
// artefacts keep separate choices (data-area="hub" or "live"): the hub
// starts dark, the projector pages start light.
(() => {
  const area = document.currentScript?.dataset.area === "live" ? "live" : "hub";
  const KEY = `steamhub.theme.${area}`;
  let theme = "";
  try { theme = localStorage.getItem(KEY) || ""; } catch { /* storage blocked */ }
  if (theme !== "light" && theme !== "dark") theme = area === "live" ? "light" : "dark";
  document.documentElement.dataset.theme = theme;

  const label = (btn) => {
    const other = theme === "dark" ? "light" : "dark";
    btn.textContent = other === "light" ? "Light mode" : "Dark mode";
    btn.setAttribute("aria-label", `Switch to ${other} mode`);
  };

  addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("[data-theme-toggle]").forEach((btn) => {
      label(btn);
      btn.addEventListener("click", () => {
        theme = theme === "dark" ? "light" : "dark";
        try { localStorage.setItem(KEY, theme); } catch { /* still switches for now */ }
        // Artefact drawings read the colours when they are drawn, so reload
        // them (and any embedded in the deck); the hub switches in place.
        if (area === "live") { location.reload(); return; }
        document.documentElement.dataset.theme = theme;
        document.querySelectorAll("[data-theme-toggle]").forEach(label);
      });
    });
  });
})();
