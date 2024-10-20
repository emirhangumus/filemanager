const fs = require("fs");
const path = require("path");

const move = async (to, items, selectType) => {
  try {
    items.forEach((item) => {
      if (selectType === "directory") {
        fs.renameSync(item, path.join(to, path.basename(item)));
      } else {
        fs.renameSync(item, path.join(to, path.basename(item)));
      }
    });
    process.exit(0);
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
};

const { FM_TO, FM_ITEMS, FM_SELECT_TYPE } = process.env;

if (!FM_TO) {
  console.error("FM_TO is required");
  process.exit(1);
}

if (!FM_ITEMS) {
  console.error("FM_ITEMS is required");
  process.exit(1);
}

if (!FM_SELECT_TYPE) {
  console.error("FM_SELECT_TYPE is required");
  process.exit(1);
}

console.log(FM_TO, FM_ITEMS, FM_SELECT_TYPE);

move(FM_TO, JSON.parse(FM_ITEMS), FM_SELECT_TYPE);
process.exit(0);
