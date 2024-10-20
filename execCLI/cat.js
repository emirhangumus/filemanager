const fs = require("fs");

const cat = async (items) => {
  try {
    items.forEach((item) => {
      console.log(fs.readFileSync(item, "utf8"));
    });
    process.exit(0);
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
};

const { FM_ITEMS } = process.env;

if (!FM_ITEMS) {
  console.error("FM_ITEMS is required");
  process.exit(1);
}

cat(JSON.parse(FM_ITEMS));
process.exit(0);
