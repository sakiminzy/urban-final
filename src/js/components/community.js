import posts from "../data/seedPosts.json";
import { ModalController } from "../utils/modalController.js";

const buildCard = (post) => `
  <article class="flex h-full flex-col gap-4 rounded-card border border-[color:var(--border)] bg-[color:var(--surface)] p-6" data-post-open data-post-id="${post.id}">
    <div class="relative overflow-hidden rounded-image bg-image-placeholder">
      <img src="${post.image}" alt="${post.title}" width="640" height="420" loading="lazy" class="h-40 w-full object-cover" />
      <span class="category-badge absolute left-4 top-4">${post.category}</span>
    </div>
    <div class="flex flex-col gap-2">
      <h3 class="text-xl font-medium text-[color:var(--text)]">${post.title}</h3>
      <p class="text-sm text-[color:var(--muted)]">${post.excerpt}</p>
      <p class="text-xs text-[color:var(--muted)]">${post.author} • ${post.date}</p>
    </div>
    <button class="mt-auto rounded-full border border-[color:var(--border)] px-4 py-2 text-base focus-ring" type="button">Read more</button>
  </article>
`;

export function initCommunityPosts() {
  const grids = Array.from(document.querySelectorAll("[data-posts-grid]"));
  if (!grids.length) return;

  const modal = document.querySelector("[data-post-modal]");
  const modalTitle = document.querySelector("[data-post-modal-title]");
  const modalBody = document.querySelector("[data-post-modal-body]");
  const modalImage = document.querySelector("[data-post-modal-image]");
  const modalClose = document.querySelector("[data-post-modal-close]");
  const modalMeta = document.querySelector("[data-post-modal-meta]");
  const modalCategory = document.querySelector("[data-post-modal-category]");

  const postModal = modal ? new ModalController(modal) : null;

  const openModal = (post) => {
    if (!postModal) return;
    modalTitle.textContent = post.title;
    const parts = post.content.split("\n\n").filter(Boolean);
    const intro = parts[0] || "";
    const rest = parts.slice(1);
    const list = rest.length
      ? `<div class="mt-2">
          <h3 class="text-sm font-medium text-[color:var(--text)]">Key notes</h3>
          <ul class="mt-2 list-disc space-y-2 pl-5 text-base text-[color:var(--muted)]">
            ${rest.map((item) => `<li>${item}</li>`).join("")}
          </ul>
        </div>`
      : "";
    modalBody.innerHTML = `<p class="text-base text-[color:var(--muted)]">${intro}</p>${list}`;
    modalImage.src = post.image;
    modalImage.alt = post.title;
    if (modalMeta) {
      modalMeta.textContent = `${post.category} • ${post.author} • ${post.date} • ${post.readTime}`;
    }
    if (modalCategory) {
      modalCategory.textContent = post.category;
    }
    postModal.open();
  };

  grids.forEach((grid) => {
    const category = grid.dataset.postsGrid;
    const items = posts.filter((post) => post.category === category);
    grid.innerHTML = items.map(buildCard).join("");
  });

  document.addEventListener("click", (event) => {
    const card = event.target.closest("[data-post-open]");
    if (!card) return;
    const postId = card.dataset.postId;
    const post = posts.find((item) => item.id === postId);
    if (post) openModal(post);
  });
}
