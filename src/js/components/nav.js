export function initNav() {
  const toggle = document.querySelector("[data-nav-toggle]");
  const menuId = toggle ? toggle.getAttribute("aria-controls") : null;
  const menu = menuId ? document.getElementById(menuId) : null;
  if (!toggle || !menu) return;

  const focusableSelector = "a[href], button, input, select, textarea, [tabindex]:not([tabindex='-1'])";

  const closeMenu = () => {
    menu.classList.add("hidden");
    menu.setAttribute("aria-hidden", "true");
    menu.hidden = true;
    toggle.setAttribute("aria-expanded", "false");
  };

  const openMenu = () => {
    menu.classList.remove("hidden");
    menu.removeAttribute("hidden");
    menu.setAttribute("aria-hidden", "false");
    toggle.setAttribute("aria-expanded", "true");
    const first = menu.querySelector(focusableSelector);
    if (first) first.focus();
  };

  const isOpen = () => toggle.getAttribute("aria-expanded") === "true";

  closeMenu();

  toggle.addEventListener("click", () => {
    if (isOpen()) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && isOpen()) {
      closeMenu();
      toggle.focus();
    }
  });

  menu.querySelectorAll("[data-nav-link]").forEach((link) => {
    link.addEventListener("click", () => closeMenu());
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth >= 1024) {
      closeMenu();
    }
  });
}
