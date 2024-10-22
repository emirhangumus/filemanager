const zip = require("adm-zip");
const tar = require("tar-fs");
const fs = require("fs");

const archive = async (currentPath, output, items, type) => {
  try {
    if (type === "zip") {
      const archive = new zip();
      items.forEach((item) => {
        archive.addLocalFile(`${item}`);
      });
      archive.writeZip(`${currentPath}/${output}.zip`);
    }

    if (type === "tar") {
      await new Promise((resolve, reject) => {
        const stream = tar
          .pack(currentPath)
          .pipe(fs.createWriteStream(`${currentPath}/${output}.tar`));
        stream.on("finish", () => resolve("Archive completed"));
        stream.on("error", (e) => reject(e));
      });
    }
    process.exit(0); // success
  } catch (e) {
    console.error("Error occurred:", e);
    process.exit(1); // failure
  }
};

const { FM_NAME, FM_ITEMS, FM_FORMAT, FM_PATH } = process.env;

if (!FM_NAME) {
  console.error("FM_NAME is required");
  process.exit(1);
}

if (!FM_ITEMS) {
  console.error("FM_ITEMS is required");
  process.exit(1);
}

if (!FM_FORMAT) {
  console.error("FM_FORMAT is required");
  process.exit(1);
}

if (!FM_PATH) {
  console.error("FM_PATH is required");
  process.exit(1);
}

archive(FM_PATH, FM_NAME, JSON.parse(FM_ITEMS), FM_FORMAT);
