const path = require('node:path');
console.log('cwd:      ', process.cwd());
console.log('__dirname:', __dirname);
console.log('joined:   ', path.join(__dirname, 'data', 'checks.json'));
