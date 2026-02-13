import "../style.css";
import { initNav } from "./components/nav.js";
import { initTabs } from "./components/tabs.js";
import { initThemeToggle } from "./components/theme.js";
import { initProductsUI } from "./components/productsUI.js";
import { initSubscribeValidation } from "./forms/validation.js";
import { initCommunityPosts } from "./components/community.js";

document.addEventListener("DOMContentLoaded", () => {
  initNav();
  initTabs();
  initThemeToggle();
  initProductsUI();
  initSubscribeValidation();
  initCommunityPosts();
});
