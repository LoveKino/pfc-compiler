'use strict';

let stubAsApis = require('../../../lib/stubAsApis');
let {
    executeAST,
    parseStrToAst
} = require('../../..');
let assert = require('assert');

describe('stubAsApis', () => {
    it('base', () => {
        let {
            add
        } = stubAsApis({
            add: {
                type: 'function'
            }
        });

        let pfcCode = add(1, 2);

        let ret = executeAST(parseStrToAst(pfcCode.code), {
            add: (v1, v2) => v1 + v2
        });

        assert.equal(ret, 3);
    });

    it('atom:string', () => {
        let {
            add
        } = stubAsApis({
            add: {
                type: 'function'
            }
        });

        let pfcCode = add('1"inner"', '2').code;

        let ret = executeAST(parseStrToAst(pfcCode), {
            add: (v1, v2) => {
                return v1 + v2;
            }
        });

        assert.equal(ret, '1"inner"2');
    });

    it('atom:null', () => {
        let {
            isNull
        } = stubAsApis({
            isNull: {
                type: 'function'
            }
        });

        let pfcCode = isNull(null);

        let ret = executeAST(parseStrToAst(pfcCode.code), {
            isNull: (v) => v === null
        });

        assert.equal(ret, true);
    });

    it('atom:true', () => {
        let {
            isTrue
        } = stubAsApis({
            isTrue: {
                type: 'function'
            }
        });

        let pfcCode = isTrue(true);

        let ret = executeAST(parseStrToAst(pfcCode.code), {
            isTrue: (v) => v === true
        });

        assert.equal(ret, true);
    });

    it('atom:false', () => {
        let {
            isFalse
        } = stubAsApis({
            isFalse: {
                type: 'function'
            }
        });

        let pfcCode = isFalse(false);

        let ret = executeAST(parseStrToAst(pfcCode.code), {
            isFalse: (v) => v === false
        });

        assert.equal(ret, true);
    });

    it('variable', () => {
        let {
            add,
            v
        } = stubAsApis({
            add: {
                type: 'function'
            },
            v: {}
        });

        let pfcCode = add(3, v);

        let ret = executeAST(parseStrToAst(pfcCode.code), {
            add: (v1, v2) => v1 + v2,
            v: 4
        });

        assert.equal(ret, 7);
    });

    it('compose', () => {
        let {
            add,
            v,
            minus
        } = stubAsApis({
            add: {
                type: 'function'
            },
            minus: {
                type: 'function'
            },
            v: {}
        });

        let pfcCode = add(3, minus(9, v));

        let ret = executeAST(parseStrToAst(pfcCode.code), {
            add: (v1, v2) => v1 + v2,
            minus: (v1, v2) => v1 - v2,
            v: 4
        });

        assert.equal(ret, 8);
    });

    it('error atom type', (done) => {
        let {
            add
        } = stubAsApis({
            add: {
                type: 'function'
            }
        });

        try {
            add(1, {});
        } catch (err) {
            assert(err.toString().indexOf('unexpected atom type') !== -1);
            done();
        }
    });

    it('validate param item', (done) => {
        let {
            add
        } = stubAsApis({
            add: {
                type: 'function',
                validateParamItem: (param, index) => {
                    if (index === 0) {
                        if (typeof param !== 'number') {
                            throw new Error('expect number');
                        }
                    }
                }
            }
        });

        try {
            add('1', 2);
        } catch (err) {
            assert(err.toString().indexOf('expect number') !== -1);
            done();
        }
    });

    it('validate params', (done) => {
        let {
            f
        } = stubAsApis({
            f: {
                type: 'function',
                validateParams: ([v1, v2]) => {
                    if (v2 - v1 > 5) {
                        throw new Error('should not');
                    }
                }
            }
        });

        try {
            f(4, 20);
        } catch (err) {
            assert(err.toString().indexOf('should not') !== -1);
            done();
        }
    });
});
