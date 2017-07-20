'use strict';

let {
    parseStrToAst,
    checkASTWithContext,
    executeAST
} = require('../..');
let assert = require('assert');

let caseData = [
    [
        ['f(g(1, 2))', {
            f: (x) => x * 2,
            g: (x, y) => x - y
        }], -2
    ],

    [
        ['f(v1, g(v2, 5))', {
            f: (x, y) => x * y,
            g: (x, y) => x + y,
            v1: 4,
            v2: 5
        }], 40
    ]
];

describe('compose', () => {
    caseData.forEach(([fst, snd]) => {
        it(fst[0], () => {
            let ast = parseStrToAst(fst[0]);
            checkASTWithContext(ast, fst[1]);
            assert.equal(executeAST(ast, fst[1]), snd);
        });
    });
});
