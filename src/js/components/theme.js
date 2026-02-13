const applyTheme = (mode) => {
  document.documentElement.classList.toggle("dark", mode === "dark");
  const darkLogo = document.querySelector("[data-theme-logo-dark]");
  const lightLogo = document.querySelector("[data-theme-logo-light]");
  if (darkLogo && lightLogo) {
    const isDark = mode === "dark";
    darkLogo.classList.toggle("hidden", !isDark);
    lightLogo.classList.toggle("hidden", isDark);
  }
};

export const initThemeToggle = () => {
  const toggle = document.querySelector("[data-theme-toggle]");
  if (!toggle) return;

  const stored = localStorage.getItem("theme");
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const initial = stored === "light" || stored === "dark"
    ? stored
    : media.matches
      ? "dark"
      : "light";

  const setLabel = (mode) => {
    const label = toggle.querySelector("[data-theme-label]");
    const text = mode === "dark" ? "Light Mode" : "Dark Mode";
    if (label) {
      label.textContent = text;
    } else {
      toggle.textContent = text;
    }
    toggle.setAttribute("aria-pressed", mode === "dark" ? "true" : "false");
    const icon = toggle.querySelector("[data-theme-icon]");
    if (icon) {
      icon.textContent = mode === "dark" ? "light_mode" : "dark_mode";
    }
  };

  applyTheme(initial);
  setLabel(initial);

  const handleSystemChange = (event) => {
    if (!localStorage.getItem("theme")) {
      const mode = event.matches ? "dark" : "light";
      applyTheme(mode);
      setLabel(mode);
    }
  };

  media.addEventListener("change", handleSystemChange);

  toggle.addEventListener("click", () => {
    const next = document.documentElement.classList.contains("dark")
      ? "light"
      : "dark";
    localStorage.setItem("theme", next);
    applyTheme(next);
    setLabel(next);
  });
};
