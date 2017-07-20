'use strict';

let {
    parseStrToAst,
    checkASTWithContext,
    executeAST
} = require('../..');
let assert = require('assert');

let caseData = [
    [
        ['true'], true
    ],

    [
        ['false'], false
    ],

    [
        ['null'], null
    ],

    [
        ['b', {
            b: 10
        }], 10
    ],

    [
        ['"hello"'], 'hello'
    ],
    [
        ['12'], 12
    ],
    [
        ['f()', {
            f: () => 1
        }],

        1
    ],
    [
        ['f(1)', {
            f: (x) => x + 1
        }],

        2
    ],
    [
        ['f(1, 2)', {
            f: (x, y) => x - y
        }],

        -1
    ],

    [
        ['f($1)', {
            f: (x) => x + 1,
            '$1': 4
        }], 5
    ]
];

describe('index', () => {
    caseData.forEach(([fst, snd]) => {
        it(fst[0], () => {
            let ast = parseStrToAst(fst[0]);
            checkASTWithContext(ast, fst[1]);
            assert.equal(executeAST(ast, fst[1]), snd);
        });
    });
});
