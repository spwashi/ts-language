const {initSpw, generatePegJsFile} = require("../dist/grammars/spw/src/generate-parser");
const path                         = require('path');
const fs                           = require('fs');
const argv                         = require('minimist')(process.argv.slice(2));

run(argv.lang || argv.l || 'spw');

async function run(lang) {
    const parser  = await initSpw();
    const grammar = await generatePegJsFile();

    // fs.writeFileSync(
    //     path.join(__dirname, '../dist/grammars', lang, 'parser.js'),
    //     'const spwParser = ' + parser + ';\nmodule.exports = {spwParser}'
    // )

    fs.writeFileSync(path.join(__dirname, 'pegjs', `${lang}.pegjs`), grammar);

    const parserFile = `
// @ts-nocheck
const parser = ${parser};

// Exports
export default parser;
export {parser as ${lang}Parser};
`;

    const deprecatedPath = path.join(__dirname, '../src/grammars', lang, 'parser.ts');
    fs.writeFileSync(deprecatedPath, parserFile);

    const generatedPath = path.join(__dirname, '../src/generated', lang, 'parser.ts');
    fs.writeFileSync(generatedPath, parserFile);
}