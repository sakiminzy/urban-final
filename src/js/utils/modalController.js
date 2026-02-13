export class ModalController {
  constructor(modalElement) {
    if (!modalElement) {
      throw new Error("Modal element is required");
    }
    this.modal = modalElement;
    this.setupEventListeners();
  }

  open() {
    this.modal.classList.remove("hidden");
    this.modal.classList.add("flex");
    this.modal.removeAttribute("aria-hidden");
    this.modal.focus();
  }

  close() {
    this.modal.classList.add("hidden");
    this.modal.classList.remove("flex");
    this.modal.setAttribute("aria-hidden", "true");
  }

  setupEventListeners() {
    const closeButton = this.modal.querySelector("[data-modal-close]");
    if (closeButton) {
      closeButton.addEventListener("click", () => this.close());
    }

    this.modal.addEventListener("click", (event) => {
      if (event.target === this.modal) {
        this.close();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !this.modal.classList.contains("hidden")) {
        this.close();
      }
    });
  }

  updateContent(config) {
    Object.entries(config).forEach(([selector, content]) => {
      const element = this.modal.querySelector(selector);
      if (element) {
        if (typeof content === "string") {
          element.textContent = content;
        } else if (typeof content === "object" && content.html) {
          element.innerHTML = content.html;
        } else {
          element.innerHTML = content;
        }
      }
    });
  }
}
