const fs = require('fs');
const path = require('path');
const process = require('process');
const writeStream = fs.createWriteStream(path.resolve(__dirname, "text.txt"));

process.stdout.write('Hello. Let\'s write some text\n');
process.stdin.on('data', (data) => {
  if(data.toString().trim() === 'exit') {
    process.stdout.write('Goodbye');
    process.exit();
  }
  writeStream.write(data);
})

process.on('SIGINT', (error) => {
  process.stdout.write('Goodbye');
  process.exit();
})