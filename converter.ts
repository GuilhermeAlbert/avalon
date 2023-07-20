const { promisify } = require("util");
const fs = require("fs");
const path = require("path");
const convert = require("heic-convert");

export async function convertHeicInFolder(
  inputFolderPath: string,
  outputFolderPath: string
) {
  const files = await promisify(fs.readdir)(inputFolderPath);

  if (files.length > 0) {
    for (let i = 0; i < files.length; i++) {
      const filePath = path.join(inputFolderPath, files[i]);
      const stat = await promisify(fs.stat)(filePath);

      if (stat.isDirectory()) {
        await convertHeicInFolder(filePath, outputFolderPath);
      } else if (path.extname(filePath).toLowerCase() === ".heic") {
        const inputBuffer = await promisify(fs.readFile)(filePath);

        const images = await convert.all({
          buffer: inputBuffer,
          format: "JPEG",
        });

        const outputFolder = path.join(
          outputFolderPath,
          path.basename(inputFolderPath)
        );

        if (!fs.existsSync(outputFolder)) {
          fs.mkdirSync(outputFolder, { recursive: true });
        }

        for (let idx in images) {
          const image = images[idx];
          const outputBuffer = await image.convert();

          const outputFilePath = path.join(
            outputFolder,
            `${path.basename(filePath, ".heic")}-${idx}.jpg`
          );

          await promisify(fs.writeFile)(outputFilePath, outputBuffer);
        }
      }
    }
  } else {
    console.log("Insert files at input folder");
  }
}
