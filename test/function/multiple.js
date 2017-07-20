let {
    compile
} = require('../..');
let assert = require('assert');

describe('multiple', () => {
    it('run multiple times', () => {
        let translate = compile('f(v1, g(v2), 3)');
        assert.equal(translate({
            f: (x, y, z) => x + y - z,
            g: (x) => x * 2,

            v1: 4,
            v2: 5
        })(), 11);

        assert.equal(translate({
            f: (x, y, z) => x + y + z,
            g: (x) => x * 2,

            v1: 4,
            v2: 8
        })(), 23);
    });
});
