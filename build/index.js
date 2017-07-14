'use strict';

let {
    buildLR1Table
} = require('syntaxer');
let fs = require('fs');
let promisify = require('es6-promisify');
let bnfer = require('bnfer');
let path = require('path');

let readFile = promisify(fs.readFile);
let writeFile = promisify(fs.writeFile);

const GRAMMER_TXT = path.join(__dirname, '../grammer/grammer.txt');
const LR1TableJsPath = path.join(__dirname, '../res/lr1Table.js');

let generateGrammer = async() => {
    let grammerText = await readFile(GRAMMER_TXT, 'utf-8');
    let grammer = bnfer.parse(grammerText);
    let table = buildLR1Table(grammer);
    await writeFile(LR1TableJsPath, `module.exports=${JSON.stringify(table)}`, 'utf-8');
};

generateGrammer();
