const path = require('path');
const fs = require('fs/promises');

const copiedFromDir = path.resolve(__dirname, 'files');
let copiedToDir = path.resolve(__dirname, 'files-copy');


async function readRidectory(directory) {
  let copiedFiles = [];
  try {
    const files = await fs.readdir(directory, {withFileTypes: true});
    for (const file of files) {
      if(file.isFile()) {
        copiedFiles.push(file);
      };
    };
    return copiedFiles;
  } catch (err) {
    console.error(err);
  }
}

async function copyFolder() {
  try {
    let copiedDir = await fs.mkdir(copiedToDir, {recursive: true});
    console.log(copiedDir);
    let copiedFiles = await readRidectory(copiedFromDir);
    for(let copiedFile of copiedFiles) {
      await fs.copyFile(path.resolve(copiedFromDir, copiedFile.name), path.resolve(copiedToDir, copiedFile.name))
    }
  } catch(err) {
    console.error(err.message);
  }
}

copyFolder();