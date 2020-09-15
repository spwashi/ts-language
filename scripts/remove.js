const fs   = require('fs');
const path = require('path');

const argv = require('minimist')(process.argv.slice(2));
const lang = argv.lang || argv.l;

try {
    lang && fs.unlinkSync(path.join(__dirname, '../src/grammars/' + lang + '/parser.ts'))
} catch (e) {
    console.log(e.message)
}