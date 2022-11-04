const fs = require('fs/promises');
const path = require('path');
const styleFolder = path.resolve(__dirname, 'styles');
const mergedStyleFile = path.resolve(__dirname, 'project-dist', 'bundle.css');

async function getStyleFiles(directory) {
  let styleFiles = [];
  try {
    const files = await fs.readdir(directory, {withFileTypes: true});
    for (const file of files) {
      if(file.isFile() && path.extname(file.name) === ".css") {
        styleFiles.push(file);
      };
    };
    return styleFiles;
  } catch (err) {
    console.error(err);
  }
}

 

async function mergeStyles() {
  let styleFiles = await getStyleFiles(styleFolder);
  let mergedStyles = "";
  for(let file of styleFiles) {
    try {
      mergedStyles += await fs.readFile(path.resolve(styleFolder, file.name), "utf-8");
    } catch(err) {
      console.error(err);
    }
  }
  await fs.writeFile(mergedStyleFile, mergedStyles);
}

mergeStyles();