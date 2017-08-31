let {
    parseStrToAst,
    checkAST,
    executeAST
} = require('../..');
let assert = require('assert');

describe('multiple', () => {
    it('run multiple times', () => {
        let ast = parseStrToAst('f(v1, g(v2), 3)');
        let variableMap = {
            f: (x, y, z) => x + y - z,
            g: (x) => x * 2,

            v1: 4,
            v2: 5
        };
        let variableStub = {
            f: {
                type: 'function'
            },
            g: {
                type: 'function'
            },
            v1: {},
            v2: {}
        };

        checkAST(ast, {
            variableStub
        });
        assert.equal(executeAST(ast, variableMap, {
            variableStub
        }), 11);

        let variableMap2 = {
            f: (x, y, z) => x + y + z,
            g: (x) => x * 2,

            v1: 4,
            v2: 8
        };
        let variableStub2 = {
            f: {
                type: 'function'
            },
            g: {
                type: 'function'
            },
            v1: {},
            v2: {}
        };
        checkAST(ast, {
            variableStub: variableStub2
        });
        assert.equal(executeAST(ast, variableMap2, {
            variableStub: variableStub2
        }), 23);
    });
});
