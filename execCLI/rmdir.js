const fs = require("fs");
const path = require("path");

const deleteFolder = async (name, p) => {
  try {
    fs.rmdirSync(path.join(p, name), { recursive: true });
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

deleteFolder(FM_NAME, FM_PATH);
process.exit(0);
