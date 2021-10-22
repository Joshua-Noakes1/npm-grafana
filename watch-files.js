const chokidar = require('chokidar');
const path = require('path');
require('log-timestamp');
const ipRegex = require('ip-regex');
const readLastLines = require('read-last-lines');

const buttonPressesLogFile = path.join(__dirname, 'logs');

console.log(`Watching for file changes on ${buttonPressesLogFile}`);

chokidar.watch(buttonPressesLogFile).on('all', (event, path) => {
  console.log(event, path)
  if (event == 'add' || event == 'change') {
    readLastLines.read(path).then((lines) => {
      if (ipRegex().test(lines)) {
        console.log(lines.match(ipRegex())[0]);
      }
    });
  }
});

// fs.watchFile(buttonPressesLogFile, (event, filename) => {
//   if (filename) {
//     console.log(`${filename} file Changed`);

//     readLastLines.read(path.join(__dirname, filename), 1).then((lines) => {
//       if (ipRegex().test(lines)) {
//         console.log(lines.match(ipRegex())[0]);
//       }
//     });

//     // fs.readFile(path.join(__dirname, filename), 'utf-8', (err, data) => {
//     //   if (err) throw err;
//     //   if (ipRegex().test(data)) {
//     //     console.log(data.match(ipRegex())[0]);
//     //   }
//     // });
//   }
// });