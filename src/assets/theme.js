// Light or dark mode. Loaded in <head> so the page draws in the right mode
// straight away. By default it follows the device (the system light or
// dark setting, which can change with the time of day), and changes with
// it while the page is open. The switch in the top bar overrides it until
// the device next changes mode, then the device's setting takes over
// again. The hub and the live artefacts keep separate choices
// (data-area="hub" or "live").
(() => {
  const area = document.currentScript?.dataset.area === "live" ? "live" : "hub";
  const KEY = `steamhub.theme.${area}`;
  const media = matchMedia("(prefers-color-scheme: dark)");
  const system = () => (media.matches ? "dark" : "light");

  // A saved choice is { theme, system }: the mode chosen, and the device's
  // mode at the time. It only counts while the device is still in that mode.
  const read = () => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) || "null");
      if (saved && saved.system === system() && (saved.theme === "light" || saved.theme === "dark")) return saved.theme;
      localStorage.removeItem(KEY);
    } catch { /* storage blocked or an old value */ }
    return system();
  };
  let theme = read();
  document.documentElement.dataset.theme = theme;

  const label = (btn) => {
    const other = theme === "dark" ? "light" : "dark";
    btn.textContent = other === "light" ? "Light mode" : "Dark mode";
    btn.setAttribute("aria-label", `Switch to ${other} mode`);
  };
  // Artefact drawings read the colours when they are drawn, so reload them
  // (the slide number is kept in the address); the hub switches in place.
  const apply = (next) => {
    if (next === theme) return;
    theme = next;
    if (area === "live") { location.reload(); return; }
    document.documentElement.dataset.theme = theme;
    document.querySelectorAll("[data-theme-toggle]").forEach(label);
  };

  media.addEventListener("change", () => apply(read()));

  addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("[data-theme-toggle]").forEach((btn) => {
      label(btn);
      btn.addEventListener("click", () => {
        const next = theme === "dark" ? "light" : "dark";
        try {
          if (next === system()) localStorage.removeItem(KEY);
          else localStorage.setItem(KEY, JSON.stringify({ theme: next, system: system() }));
        } catch { /* still switches for now */ }
        apply(next);
      });
    });
  });
})();
