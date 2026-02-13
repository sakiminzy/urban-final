export function initTabs() {
  const root = document.querySelector("[data-tabs]");
  if (!root) return;

  const tabs = Array.from(root.querySelectorAll("[role='tab']"));
  const panels = Array.from(root.querySelectorAll("[role='tabpanel']"));

  const activateTab = (tab) => {
    tabs.forEach((t) => {
      const selected = t === tab;
      t.setAttribute("aria-selected", selected ? "true" : "false");
      t.tabIndex = selected ? 0 : -1;
    });

    panels.forEach((panel) => {
      const isActive = panel.id === tab.getAttribute("aria-controls");
      panel.hidden = !isActive;
    });
  };

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => activateTab(tab));
    tab.addEventListener("keydown", (event) => {
      const currentIndex = tabs.indexOf(tab);
      if (event.key === "ArrowRight") {
        const next = tabs[(currentIndex + 1) % tabs.length];
        next.focus();
        activateTab(next);
      }
      if (event.key === "ArrowLeft") {
        const prev = tabs[(currentIndex - 1 + tabs.length) % tabs.length];
        prev.focus();
        activateTab(prev);
      }
      if (event.key === "Home") {
        const first = tabs[0];
        first.focus();
        activateTab(first);
      }
      if (event.key === "End") {
        const last = tabs[tabs.length - 1];
        last.focus();
        activateTab(last);
      }
    });
  });

  activateTab(tabs[0]);
}
