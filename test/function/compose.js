'use strict';

let {
    compile
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
            assert.equal(compile(fst[0])(fst[1]), snd);
        });
    });
});
