const fs = require('fs');
const content = [
  '*',
  '!asset-manifest.json',
  '!favicon.ico',
  '!index.html',
  '!manifest.json',
  '!service-worker.js',
  '!/static'
].join('\n');
const path = './.gitignore';
fs.writeFile(path, content, (writeErr) => {
  if (!writeErr) {
    console.log(`success write ${path}`);
  }
});