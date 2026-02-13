const express = require("express");
const path = require("path");
const crypto = require("crypto");
const requireFields = require("../middleware/validate");
const { readJson, writeJson } = require("../utils/fileDb");

const router = express.Router();
const dataFile = path.join(__dirname, "..", "data", "subscriptions.json");

router.get("/", async (req, res, next) => {
  try {
    const subscriptions = await readJson(dataFile);
    res.status(200).json({ success: true, data: subscriptions });
  } catch (error) {
    next(error);
  }
});

router.post("/", requireFields(["name", "email", "plan"]), async (req, res, next) => {
  try {
    const subscriptions = await readJson(dataFile);
    const { name, email, plan } = req.body;

    const subscription = {
      id: `sub-${crypto.randomUUID()}`,
      name,
      email,
      plan,
      createdAt: new Date().toISOString()
    };

    subscriptions.push(subscription);
    await writeJson(dataFile, subscriptions);

    res.status(201).json({ success: true, data: subscription });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
