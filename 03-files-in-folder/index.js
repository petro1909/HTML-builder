const fs = require('fs/promises');
const path = require('path');
const folderPath = path.resolve(__dirname, 'secret-folder');

async function readRidectory() {
  try {
    const files = await fs.readdir(folderPath, {withFileTypes: true});
    for (const file of files) {
      if(file.isFile()) {
       await writeFileInfo(file);
      };
    };
  } catch (err) {
    console.error(err);
  }
}

async function writeFileInfo(file) {
  let fileInfo = await fs.stat(path.resolve(folderPath, file.name));
  file = file.name
  let fileName = path.basename(file, path.extname(file));
  let fileExtension = path.extname(file).slice(1);
  let fileSize = fileInfo.size / 1024;
  console.log(`${fileName} - ${fileExtension} - ${fileSize.toFixed(3)}kb`);
}

readRidectory();
