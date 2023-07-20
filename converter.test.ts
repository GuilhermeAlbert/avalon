import * as fs from "fs";
import { promisify } from "util";
import * as path from "path";
import { convertHeicInFolder } from "./converter";

const testInputFolderPath = "./test-images";
const testOutputFolderPath = "./test-converted-images";

async function removeFolder(folderPath: string) {
  if (fs.existsSync(folderPath)) {
    for (const entry of await promisify(fs.readdir)(folderPath)) {
      const entryPath = path.join(folderPath, entry);
      const stat = await promisify(fs.stat)(entryPath);

      if (stat.isDirectory()) {
        await removeFolder(entryPath);
      } else {
        await promisify(fs.unlink)(entryPath);
      }
    }

    await promisify(fs.rmdir)(folderPath);
  }
}

beforeAll(async () => {
  if (!fs.existsSync(testInputFolderPath)) {
    fs.mkdirSync(testInputFolderPath);
  }
});

afterEach(async () => {
  await removeFolder(testOutputFolderPath);
});

describe("convertHeicInFolder", () => {
  beforeAll(() => {
    if (!fs.existsSync(testOutputFolderPath)) {
      fs.mkdirSync(testOutputFolderPath, { recursive: true });
    }
  });

  it("should convert all .heic files in a directory", async () => {
    const testHeicFilePath = path.join(testInputFolderPath, "test.heic");

    await convertHeicInFolder(testInputFolderPath, testOutputFolderPath);

    const outputFiles = await promisify(fs.readdir)(testOutputFolderPath);

    expect(outputFiles.length).toBeGreaterThan(0);

    outputFiles.forEach((file) => {
      expect(path.extname(file).toLowerCase()).toBe(".jpg");
    });
  });
});
