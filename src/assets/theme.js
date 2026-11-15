// The site is light only: there is no dark mode and no switch (James,
// November 2026). Every page still loads this file in <head>, so it marks
// the page as light and clears any choice an older version saved.
(() => {
  document.documentElement.dataset.theme = "light";
  try {
    localStorage.removeItem("steamhub.theme.hub");
    localStorage.removeItem("steamhub.theme.live");
  } catch { /* storage blocked: nothing to clear */ }
})();
