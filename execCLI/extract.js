const zip = require("adm-zip");
const tar = require("tar-fs");
const fs = require("fs");

const extract = async (source, target, type) => {
  try {
    if (type === "zip") {
      const zipFile = new zip(source);
      zipFile.extractAllTo(target, true);
    }

    if (type === "tar") {
      await new Promise((resolve, reject) => {
        const stream = fs.createReadStream(source).pipe(tar.extract(target));
        stream.on("finish", () => resolve("Extraction completed"));
        stream.on("error", (e) => reject(e));
      });
    }
    process.exit(0); // success
  } catch (e) {
    console.error("Error occurred:", e);
    process.exit(1); // failure
  }
};

const { FM_SOURCE, FM_TARGET, FM_EXTRACT_TYPE } = process.env;

if (!FM_SOURCE) {
  console.error("FM_SOURCE is not defined");
  process.exit(1);
}

if (!FM_TARGET) {
  console.error("FM_TARGET is not defined");
  process.exit(1);
}

if (!FM_EXTRACT_TYPE) {
  console.error("FM_EXTRACT_TYPE is not defined");
  process.exit(1);
}

extract(FM_SOURCE, FM_TARGET, FM_EXTRACT_TYPE).then(() => {
  console.log("Extraction completed successfully");
});
