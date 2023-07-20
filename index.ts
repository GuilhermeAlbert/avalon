import { convertHeicInFolder } from "./converter";

const inputFolderPath = process.env.INPUT_FOLDER_PATH ?? "./images";
const outputFolderPath = process.env.INPUT_FOLDER_PATH ?? "./converted-images";

convertHeicInFolder(inputFolderPath, outputFolderPath);
