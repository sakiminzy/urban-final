import { getProducts } from "../api/productsService.js";
import { ModalController } from "../utils/modalController.js";

const formatPrice = (value) => {
  const numeric = Number(value);
  if (Number.isNaN(numeric)) return value;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(numeric);
};

const normalizeString = (value) => value.toLowerCase().trim();

export async function initProductsUI() {
  const grid = document.querySelector("[data-products-grid]");
  if (!grid) return;

  const searchInput = document.querySelector("[data-products-search]");
  const categorySelect = document.querySelector("[data-products-category]");
  const sortSelect = document.querySelector("[data-products-sort]");
  const inStockToggle = document.querySelector("[data-products-stock]");
  const emptyState = document.querySelector("[data-products-empty]");
  const banner = document.querySelector("[data-api-banner]");
  const countEl = document.querySelector("[data-products-count]");
  const modal = document.querySelector("[data-product-modal]");
  const modalTitle = document.querySelector("[data-product-modal-title]");
  const modalMeta = document.querySelector("[data-product-modal-meta]");
  const modalCategory = document.querySelector("[data-product-modal-category]");
  const modalImage = document.querySelector("[data-product-modal-image]");
  const modalPrice = document.querySelector("[data-product-modal-price]");
  const modalStock = document.querySelector("[data-product-modal-stock]");
  const modalScore = document.querySelector("[data-product-modal-score]");
  const modalBody = document.querySelector("[data-product-modal-body]");
  const modalClose = document.querySelector("[data-product-modal-close]");

  const { items, source, message } = await getProducts();
  const products = Array.isArray(items) ? items : [];

  if (banner && source === "fallback") {
    banner.textContent = message;
    banner.classList.remove("hidden");
  }

  const categories = Array.from(new Set(products.map((product) => product.category))).sort();
  if (categorySelect) {
    categorySelect.innerHTML = [
      "<option value=\"\">All categories</option>",
      ...categories.map((category) => `<option value=\"${category}\">${category}</option>`)
    ].join("");
  }

  const getFilters = () => ({
    query: searchInput ? normalizeString(searchInput.value) : "",
    category: categorySelect ? categorySelect.value : "",
    sort: sortSelect ? sortSelect.value : "featured",
    inStockOnly: inStockToggle ? inStockToggle.checked : false
  });

  const applyFilters = (list, filters) => {
    let filtered = [...list];
    if (filters.query) {
      filtered = filtered.filter((product) => {
        const haystack = `${product.name} ${product.category} ${product.description}`.toLowerCase();
        return haystack.includes(filters.query);
      });
    }
    if (filters.category) {
      filtered = filtered.filter((product) => product.category === filters.category);
    }
    if (filters.inStockOnly) {
      filtered = filtered.filter((product) => product.inStock);
    }
    return filtered;
  };

  const applySort = (list, sort) => {
    const sorted = [...list];
    if (sort === "price-asc") {
      sorted.sort((a, b) => Number(a.price) - Number(b.price));
    }
    if (sort === "price-desc") {
      sorted.sort((a, b) => Number(b.price) - Number(a.price));
    }
    if (sort === "sustainability") {
      sorted.sort((a, b) => Number(b.sustainabilityScore) - Number(a.sustainabilityScore));
    }
    return sorted;
  };

  const render = (list) => {
    grid.innerHTML = list
      .map(
        (product) => `
          <article class="flex flex-col gap-5 rounded-card border border-[color:var(--border)] bg-[color:var(--surface)] p-6">
            <div class="relative h-48 w-full overflow-hidden rounded-image bg-image-placeholder">
              <img src="${product.image}" alt="${product.name}" width="640" height="420" loading="lazy" class="h-full w-full object-cover" />
              <span class="category-badge absolute left-4 top-4">${product.category}</span>
              <span class="absolute right-4 top-4 rounded-full bg-[color:var(--accent)] px-3 py-1 text-xs text-white">Score ${product.sustainabilityScore}</span>
            </div>
            <div class="flex items-start justify-between gap-4">
              <div>
                <h3 class="text-2xl font-medium text-[color:var(--text)]">${product.name}</h3>
                <p class="mt-2 text-base text-[color:var(--muted)]">${product.description}</p>
                <div class="mt-3 flex flex-wrap items-center gap-3 text-sm">
                  <span class="badge">${product.inStock ? "In stock" : "Harvesting"}</span>
                  <span class="badge">${product.category}</span>
                </div>
              </div>
              <span class="text-3xl font-semibold text-[color:var(--text)]">${formatPrice(product.price)}</span>
            </div>
            <div class="flex flex-wrap items-center gap-3">
              <button class="rounded-full bg-[color:var(--accent)] px-6 py-2.5 text-base font-medium text-white focus-ring" type="button" data-product-open data-product-id="${product.id}">View details</button>
              <button class="rounded-full border border-[color:var(--border)] px-4 py-2 text-base focus-ring" type="button">Save</button>
            </div>
          </article>
        `
      )
      .join("");

    if (countEl) {
      countEl.textContent = `${list.length} items`;
    }

    if (emptyState) {
      emptyState.classList.toggle("hidden", list.length !== 0);
    }
  };

  const update = () => {
    const filters = getFilters();
    const filtered = applyFilters(products, filters);
    const sorted = applySort(filtered, filters.sort);
    render(sorted);
  };

  const productModal = modal ? new ModalController(modal) : null;

  const openModal = (product) => {
    if (!productModal) return;
    if (modalTitle) modalTitle.textContent = product.name;
    if (modalMeta) modalMeta.textContent = `${product.origin || "Neighborhood grower"} • ${product.harvestDate || "Harvested today"}`;
    if (modalCategory) modalCategory.textContent = product.category;
    if (modalImage) {
      modalImage.src = product.image;
      modalImage.alt = product.name;
    }
    if (modalPrice) modalPrice.textContent = formatPrice(product.price);
    if (modalStock) modalStock.textContent = product.inStock ? "In stock now" : "Harvesting for next delivery";
    if (modalScore) modalScore.textContent = `${product.sustainabilityScore}`;
    if (modalBody) {
      modalBody.innerHTML = `
        <p>${product.description}</p>
        <div class="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-5">
          <h3 class="text-base font-medium text-[color:var(--text)]">Harvest notes</h3>
          <ul class="mt-2 list-disc space-y-2 pl-5 text-base text-[color:var(--muted)]">
            ${(product.notes || []).map((note) => `<li>${note}</li>`).join("")}
          </ul>
        </div>
      `;
    }
    productModal.open();
  };

  document.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-product-open]");
    if (!trigger) return;
    const productId = trigger.dataset.productId;
    const product = products.find((item) => item.id === productId);
    if (product) openModal(product);
  });

  [searchInput, categorySelect, sortSelect, inStockToggle].forEach((control) => {
    if (!control) return;
    control.addEventListener("input", update);
    control.addEventListener("change", update);
  });

  update();
}
