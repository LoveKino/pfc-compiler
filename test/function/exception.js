'use strict';

let {
    compile
} = require('../..');
let assert = require('assert');

describe('exception', () => {
    it('missing function', (done) => {
        try {
            compile('f1()')()();
        } catch (err) {
            assert(err.toString().indexOf('missing function') !== -1);
            done();
        }
    });

    it('missing variable', (done) => {
        try {
            compile('a')()();
        } catch (err) {
            assert(err.toString().indexOf('missing variable') !== -1);
            done();
        }
    });

    it('null string', (done) => {
        try {
            compile(null)()();
        } catch (e) {
            done();
        }
    });
});
