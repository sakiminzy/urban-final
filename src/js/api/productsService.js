import seedProducts from "../data/seedProducts.json";
import { request } from "./http.js";

export async function getProducts() {
  try {
    const response = await request("/products");
    const items = Array.isArray(response?.data) ? response.data : response;
    return {
      items,
      source: "api"
    };
  } catch (error) {
    return {
      items: seedProducts,
      source: "fallback",
      message: "API unavailable. Showing locally cached products."
    };
  }
}
