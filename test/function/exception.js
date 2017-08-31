'use strict';

let {
    parseStrToAst,
    checkAST,
    executeAST
} = require('../..');
let assert = require('assert');

describe('exception', () => {
    it('missing function', (done) => {
        try {
            checkAST(parseStrToAst('f1()'));
        } catch (err) {
            assert(err.toString().indexOf('missing function') !== -1);
            done();
        }
    });

    it('missing variable', (done) => {
        try {
            checkAST(parseStrToAst('a'));
        } catch (err) {
            assert(err.toString().indexOf('missing variable') !== -1);
            done();
        }
    });

    it('null string', (done) => {
        try {
            parseStrToAst(null);
        } catch (e) {
            done();
        }
    });

    it('runtime-missing-variable', (done) => {
        try {
            executeAST(parseStrToAst('a'), {}, {
                variableStub: {
                    'a': {}
                }
            });
        } catch (err) {
            assert(err.toString().indexOf('missing variable') !== -1);
            done();
        }
    });

    it('runtime-function-not-match', (done) => {
        try {
            executeAST(parseStrToAst('f()'), {
                f: 10
            }, {
                variableStub: {
                    'f': {
                        type: 'function'
                    }
                }
            });
        } catch (err) {
            assert(err.toString().indexOf('is not function') !== -1);
            done();
        }
    });

    it('runtime-missing-variable2', (done) => {
        try {
            executeAST(parseStrToAst('a'), {});
        } catch (err) {
            assert(err.toString().indexOf('missing variable') !== -1);
            done();
        }
    });

    it('validate', (done) => {
        try {
            executeAST(parseStrToAst('a'), {
                a: 12
            }, {
                variableStub: {
                    a: {
                        validate: (v) => {
                            if (v > 10) {
                                throw new Error('value must less than 10');
                            }
                        }
                    }
                }
            });
        } catch (err) {
            assert(err.toString().indexOf('value must less than 10') !== -1);
            done();
        }
    });

    it('validate', (done) => {
        try {
            executeAST(parseStrToAst('add(v1, v2)'), {
                add: (v1, v2) => v1 + v2,
                v1: '1',
                v2: '2'
            }, {
                variableStub: {
                    add: {
                        type: 'function',
                        validateParams: (params) => {
                            if (typeof params[0] !== 'number') {
                                throw new Error('first param of add must be number');
                            }
                        }
                    }
                }
            });
        } catch (err) {
            assert(err.toString().indexOf('first param of add must be number') !== -1);
            done();
        }
    });
});
