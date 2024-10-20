const fs = require("fs");
const p = require("path");

const createFile = async (path, file) => {
  try {
    const l = p.join(path, file);
    fs.writeFileSync(l, "shit content", { flag: "wx" });
    console.log("FM:CREATED");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

const { FM_PATH, FM_TMPSTR } = process.env;

if (!FM_TMPSTR) {
  console.error("FM_TMPSTR is not defined");
  process.exit(1);
}

if (!FM_PATH) {
  console.error("FM_PATH is not defined");
  process.exit(1);
}

createFile(FM_PATH, FM_TMPSTR);
process.exit(0);
