const express = require("express");
const path = require("path");
const crypto = require("crypto");
const requireFields = require("../middleware/validate");
const { readJson, writeJson } = require("../utils/fileDb");

const router = express.Router();
const dataFile = path.join(__dirname, "..", "data", "products.json");

router.get("/", async (req, res, next) => {
  try {
    const products = await readJson(dataFile);
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    next(error);
  }
});

router.post("/", requireFields(["name", "category", "price"]), async (req, res, next) => {
  try {
    const products = await readJson(dataFile);
    const { id, name, category, price, description, image, sustainabilityScore, inStock } = req.body;
    const numericPrice = Number(price);

    if (Number.isNaN(numericPrice)) {
      return res.status(400).json({
        success: false,
        error: {
          message: "Price must be a number"
        }
      });
    }

    if (id && products.some((product) => product.id === id)) {
      return res.status(409).json({
        success: false,
        error: {
          message: "Product ID already exists"
        }
      });
    }

    const product = {
      id: id || `uh-${crypto.randomUUID()}`,
      name,
      category,
      price: numericPrice,
      description: description || "",
      image: image || "",
      sustainabilityScore: Number(sustainabilityScore) || 80,
      inStock: inStock !== undefined ? Boolean(inStock) : true
    };

    products.push(product);
    await writeJson(dataFile, products);

    res.status(201).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
