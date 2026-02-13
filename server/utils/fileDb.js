const fs = require("fs/promises");
const path = require("path");

const ensureFile = async (filePath) => {
  try {
    await fs.access(filePath);
  } catch {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, "[]", "utf-8");
  }
};

const readJson = async (filePath) => {
  await ensureFile(filePath);
  const raw = await fs.readFile(filePath, "utf-8");
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
};

const writeJson = async (filePath, data) => {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
};

module.exports = {
  readJson,
  writeJson
};
