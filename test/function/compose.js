'use strict';

let {
    parseStrToAst,
    checkAST,
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
            if (fst[2]) {
                checkAST(ast, {
                    variableStub: fst[2]
                });
            }
            assert.equal(executeAST(ast, fst[1], {
                variableStub: fst[2]
            }), snd);
        });
    });
});
