const express = require("express");
const cors = require("cors");
const logger = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");
const productsRoutes = require("./routes/products.routes");
const subscriptionsRoutes = require("./routes/subscriptions.routes");

const app = express();

app.use(cors({ origin: ["http://localhost:5173", "http://localhost:4173"] }));
app.use(logger);
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ success: true, message: "Urban Harvest API running" });
});

app.use("/products", productsRoutes);
app.use("/subscriptions", subscriptionsRoutes);

app.use(errorHandler);

module.exports = app;
