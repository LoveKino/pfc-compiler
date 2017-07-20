'use strict';

let {
    parseStrToAst,
    checkASTWithContext
} = require('../..');
let assert = require('assert');

describe('exception', () => {
    it('missing function', (done) => {
        try {
            checkASTWithContext(parseStrToAst('f1()'));
        } catch (err) {
            assert(err.toString().indexOf('missing function') !== -1);
            done();
        }
    });

    it('missing variable', (done) => {
        try {
            checkASTWithContext(parseStrToAst('a'));
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
});
