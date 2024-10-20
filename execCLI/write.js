const fs = require("fs");

const write = async (file, content) => {
  try {
    // Write the content to the file
    fs.writeFileSync(file, content);
    process.exit(0);
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
};

const { FM_PATH, FM_CONTENT } = process.env;

if (!FM_PATH) {
  console.error("FM_PATH is required");
  process.exit(1);
}

if (!FM_CONTENT) {
  console.error("FM_CONTENT is required");
  process.exit(1);
}

write(FM_PATH, FM_CONTENT);
