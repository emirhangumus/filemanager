const fs = require("fs");
const path = require("path");

const deleteFile = async (name, p) => {
  try {
    fs.unlinkSync(path.join(p, name));
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

deleteFile(FM_NAME, FM_PATH);
process.exit(0);
