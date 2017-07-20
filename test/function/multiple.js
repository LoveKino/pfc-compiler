let {
    parseStrToAst,
    checkASTWithContext,
    executeAST
} = require('../..');
let assert = require('assert');

describe('multiple', () => {
    it('run multiple times', () => {
        let ast = parseStrToAst('f(v1, g(v2), 3)');
        assert.equal(executeAST(ast, checkASTWithContext(ast, {
            f: (x, y, z) => x + y - z,
            g: (x) => x * 2,

            v1: 4,
            v2: 5
        })), 11);

        assert.equal(executeAST(ast, checkASTWithContext(ast, {
            f: (x, y, z) => x + y + z,
            g: (x) => x * 2,

            v1: 4,
            v2: 8
        })), 23);
    });
});
