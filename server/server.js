const app = require("./app");

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  if (process.env.NODE_ENV !== "production") {
    console.log(`Urban Harvest API listening on port ${PORT}`);
  }
});

module.exports = server;
