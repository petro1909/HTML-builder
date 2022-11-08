const fs = require('fs/promises');
const path = require('path');
const distPath = path.resolve(__dirname, 'project_dist');

async function mergeStyles() {
  let styleDirectory = path.resolve(__dirname, 'styles');
  let styleFiles = await fs.readdir(styleDirectory, {withFileTypes: true});
  let mergedStyles = "";
  for (const file of styleFiles) {
    if(file.isFile() && path.extname(file.name) === ".css") {
      try {
        mergedStyles += await fs.readFile(path.resolve(styleDirectory, file.name), "utf-8");
      } catch(err) {
        console.log(err);
      }
    }
  }
  let distStyleFile = path.resolve(distPath, 'style.css');
  await fs.writeFile(distStyleFile, mergedStyles);
}

async function mergeHtml() {
  let htmlComponentsDirectory = path.resolve(__dirname, 'components');
  let htmlComponentFiles = await fs.readdir(htmlComponentsDirectory, {withFileTypes: true});
  let htmlComponents = [];
  for(const htmlComponentFile of htmlComponentFiles) {
    let extension = path.extname(htmlComponentFile.name);
    if(htmlComponentFile.isFile() && extension === ".html") {
      let fileName = path.basename(htmlComponentFile.name, extension);
      let fileContent = await fs.readFile(path.resolve(htmlComponentsDirectory, htmlComponentFile.name), "utf-8");
      htmlComponents.push({name: fileName, content: fileContent});
    }
  }

  let templateFile = path.resolve(__dirname, 'template.html');
  let htmlIndexFile = path.resolve(distPath, 'index.html');
  let templateFileContent = await fs.readFile(templateFile, "utf-8");
  for(let component of htmlComponents) {
    let componentIndex = templateFileContent.indexOf(`{{${component.name}}}`);
    while(componentIndex != -1) {
      templateFileContent = templateFileContent.slice(0, componentIndex) + component.content + templateFileContent.slice(componentIndex + component.name.length + 4);
      componentIndex = templateFileContent.indexOf(`{{${component.name}}}`);
    }
  }
  await fs.writeFile(htmlIndexFile, templateFileContent);
}

async function copyAssets() {
  await fs.rm(path.resolve(distPath, 'assets'), { recursive: true, force: true});
  let destAssetsDirectory = await fs.mkdir(path.resolve(distPath, 'assets'), {recursive: true});
  if(!destAssetsDirectory) {
    destAssetsDirectory = path.resolve(distPath, 'assets');
  }
  let srcAssetsDirectory = path.resolve(__dirname, 'assets');
  copyFolder(srcAssetsDirectory, destAssetsDirectory);
  
  async function copyFolder(srcFolder, destFolder) {
      let folderInners = await fs.readdir(srcFolder, {withFileTypes: true});
      for(let folderInner of folderInners) {
        if(folderInner.isFile()) {
          fs.copyFile(path.resolve(srcFolder, folderInner.name), path.resolve(destFolder, folderInner.name));
          
        } else {
          let innerFolder = await fs.mkdir(path.resolve(destFolder, folderInner.name), {recursive: true});
          
          if(!innerFolder) {
            innerFolder = path.resolve(destFolder, folderInner.name)
          }
          copyFolder(path.resolve(srcFolder, folderInner.name), innerFolder);
        }
      }
  }
}


async function createDist() {
  try {
    await fs.mkdir(distPath, {recursive: true});
    await mergeHtml();
    await mergeStyles();
    await copyAssets();
  } catch(err) {
    console.log(err);
  }
}

createDist();