'use strict';

let {
    compile
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
    ]
];

describe('index', () => {
    caseData.forEach(([fst, snd]) => {
        it(fst[0], () => {
            assert.equal(compile(fst[0])(fst[1]), snd);
        });
    });
});
