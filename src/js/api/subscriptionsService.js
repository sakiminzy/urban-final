import { request } from "./http.js";

export async function createSubscription(payload) {
  try {
    const response = await request("/subscriptions", {
      method: "POST",
      body: JSON.stringify(payload)
    });
    return {
      ok: true,
      data: response
    };
  } catch (error) {
    return {
      ok: false,
      error
    };
  }
}
