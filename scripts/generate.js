const {initSpw, generatePegJsFile} = require("../dist/grammars/spw/src/generate-parser");
const path                         = require('path');
const fs                           = require('fs');
const argv                         = require('minimist')(process.argv.slice(2));

run(argv.lang || argv.l || 'spw');

async function run(lang) {
    const parser  = await initSpw();
    const grammar = await generatePegJsFile();

    fs.writeFileSync(
        path.join(__dirname, '../dist/grammars', lang, 'parser.js'),
        'const spwParser = ' + parser + ';\nmodule.exports = {spwParser}'
    )
    fs.writeFileSync(
        path.join(__dirname, 'pegjs', `${lang}.pegjs`),
        grammar
    )
    fs.writeFileSync(
        path.join(__dirname, '../src/grammars', lang, 'parser.ts'),
        '// @ts-nocheck\nexport default ' + parser + ''
    )
}