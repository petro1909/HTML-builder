const fs = require('fs');
const path = require('path');
const process = require('process');

const stream = fs.createReadStream(path.resolve(__dirname, "text.txt"), "utf-8");
stream.on('data', (chunck) => {
  process.stdout.write(chunck);
});