import { createSubscription } from "../api/subscriptionsService.js";

export function initSubscribeValidation() {
  const form = document.querySelector("[data-subscribe-form]");
  if (!form) return;

  const successBanner = form.querySelector("[data-form-success]");
  const errorBanner = form.querySelector("[data-form-error]");
  const apiBanner = document.querySelector("[data-api-banner]");
  const submitButton = form.querySelector("[data-submit-button]");
  const submitLabel = form.querySelector("[data-submit-label]");
  const submitIcon = form.querySelector("[data-submit-icon]");

  const fields = {
    name: form.querySelector("#full-name"),
    email: form.querySelector("#email"),
    plan: form.querySelector("#plan"),
    agree: form.querySelector("#agree")
  };

  const errors = {
    name: form.querySelector("#full-name-error"),
    email: form.querySelector("#email-error"),
    plan: form.querySelector("#plan-error"),
    agree: form.querySelector("#agree-error")
  };

  const setError = (field, errorEl, message) => {
    if (!field || !errorEl) return;
    errorEl.textContent = message;
    field.setAttribute("aria-invalid", message ? "true" : "false");
  };

  const resetBanners = () => {
    if (successBanner) successBanner.classList.add("hidden");
    if (errorBanner) errorBanner.classList.add("hidden");
  };

  const validateName = () => {
    const value = fields.name.value.trim();
    const message = value ? "" : "Full name is required.";
    setError(fields.name, errors.name, message);
    return !message;
  };

  const validateEmail = () => {
    const value = fields.email.value.trim();
    const valid = value && fields.email.checkValidity();
    const message = valid ? "" : "Enter a valid email address.";
    setError(fields.email, errors.email, message);
    return !message;
  };

  const validatePlan = () => {
    const value = fields.plan.value;
    const message = value ? "" : "Select a plan to continue.";
    setError(fields.plan, errors.plan, message);
    return !message;
  };

  const validateAgree = () => {
    const message = fields.agree.checked ? "" : "You must agree before subscribing.";
    setError(fields.agree, errors.agree, message);
    return !message;
  };

  const validateAll = () => {
    const results = [validateName(), validateEmail(), validatePlan(), validateAgree()];
    return results.every(Boolean);
  };

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    resetBanners();
    if (!validateAll()) return;

    let originalLabel = "";
    if (submitButton) {
      originalLabel = submitLabel ? submitLabel.textContent : submitButton.textContent;
      submitButton.disabled = true;
    }
    const payload = {
      name: fields.name.value.trim(),
      email: fields.email.value.trim(),
      plan: fields.plan.value
    };

    const result = await createSubscription(payload);
    if (result.ok) {
      if (submitLabel) submitLabel.textContent = "Subscribed";
      if (submitIcon) submitIcon.classList.remove("hidden");
      form.reset();
    } else {
      if (apiBanner) {
        apiBanner.textContent = "API offline. Submission stored locally for demo.";
        apiBanner.classList.remove("hidden");
      }
      if (submitLabel) submitLabel.textContent = "Saved";
      if (submitIcon) submitIcon.classList.remove("hidden");
      if (errorBanner) errorBanner.classList.remove("hidden");
    }

    if (submitButton) {
      setTimeout(() => {
        if (submitLabel) submitLabel.textContent = originalLabel || "Submit subscription";
        if (submitIcon) submitIcon.classList.add("hidden");
        submitButton.disabled = false;
      }, 5000);
    }
  });

  fields.name.addEventListener("input", () => {
    resetBanners();
    validateName();
  });
  fields.email.addEventListener("input", () => {
    resetBanners();
    validateEmail();
  });
  fields.plan.addEventListener("change", () => {
    resetBanners();
    validatePlan();
  });
  fields.agree.addEventListener("change", () => {
    resetBanners();
    validateAgree();
  });
}

