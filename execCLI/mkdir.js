const fs = require("fs");
const path = require("path");

const mkdir = (name, p) => {
  try {
    fs.mkdirSync(path.join(p, name));
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
};

const { FM_NAME, FM_PATH } = process.env;

if (!FM_NAME) {
  console.error("FM_NAME is required");
  process.exit(1);
}

if (!FM_PATH) {
  console.error("FM_PATH is required");
  process.exit(1);
}

mkdir(FM_NAME, FM_PATH);
process.exit(0);
