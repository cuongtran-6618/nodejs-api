console.log('server init');

// import os, get information about the localhost OS
const os = require('os');
// import path
const path = require('path');

console.log(os.type());
console.log(os.version());
console.log(os.homedir());

console.log(__dirname);
console.log(__filename);

console.log(path.dirname(__filename));
console.log(path.basename(__filename));
console.log(path.extname(__filename));
