'use strict';

let {
    isObject,
    isFunction
} = require('../src/util');

/**
 * we got stub and use it as apis to ccontruct pfc code
 */

module.exports = (variableStub = {}) => {
    let apiMap = {};

    for (let name in variableStub) {
        let stub = variableStub[name];
        if (stub.type === 'function') {
            apiMap[name] = (...params) => callStubFunction(name, params, variableStub[name] || {});
        } else {
            apiMap[name] = callStubVariable(name);
        }
    }

    return apiMap;
};

let callStubVariable = (variable) => {
    return {
        code: `${variable}`,
        type: 'variable'
    };
};

let callStubFunction = (variable, params, stub) => {
    let code = `${variable}(`;

    let fullAtoms = true,
        paramValues = [];

    for (let i = 0; i < params.length; i++) {
        let param = params[i];
        if (isObject(param) && param.type === 'function') {
            code += param.code;
            fullAtoms = false;
        } else if (isObject(param) && param.type === 'variable') {
            code += param.code;
            fullAtoms = false;
        } else {
            paramValues.push(param);
            // validate atom param
            if (isFunction(stub.validateParamItem)) {
                stub.validateParamItem(param, i);
            }
            code += serializeAtom(param);
        }

        if (i < params.length - 1) {
            code += ',';
        }
    }

    if (fullAtoms && isFunction(stub.validateParams)) {
        stub.validateParams(paramValues);
    }

    code += ')';

    return {
        type: 'function',
        code
    };
};

let serializeAtom = (atom) => {
    if (typeof atom === 'string') {
        return JSON.stringify(atom);
    } else if (atom === null) {
        return 'null';
    } else if (atom === true) {
        return 'true';
    } else if (atom === false) {
        return 'false';
    } else if (typeof atom === 'number') {
        return atom + '';
    } else {
        throw new Error(`unexpected atom type in pfc, atom is ${atom}.`);
    }
};
