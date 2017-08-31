let {
    T_VARIABLE,
    T_FUNCTION,

    A_DEFAULT
} = require('./const');

let {
    isObject,
    isFunction
} = require('./util');

/**
 *
 * variableStub = {
 *    [variableName]: {
 *       type,
 *       default,  // default value of variable
 *       validate // function used to check dynamic
 *    }
 * }
 *
 *
 * TODO restraints checking
 */

/**
 * static checking
 */
let checkAST = (mid, {
    variableStub = {}
} = {}) => {
    let stack = [mid];

    while (stack.length) {
        let top = stack.pop();
        let midType = top.type;

        if (midType === T_VARIABLE) {
            let varName = top.name;
            if (!variableStub.hasOwnProperty(varName)) {
                throw new Error(`missing variable ${varName}.`);
            }
        } else if (midType === T_FUNCTION) { // function
            let name = top.name;
            let stub = variableStub[name];
            if (!isObject(stub) || stub.type !== T_FUNCTION) {
                throw new Error(`missing function ${name}.`);
            }
            // push params
            let params = top.params;
            let paramLen = params.length;
            for (let i = 0; i < paramLen; i++) {
                stack.push(params[i]);
            }
        }
    }
};

let runTimeCheck = (variableStub, variableMap) => {
    for (let name in variableStub) {
        let stub = variableStub[name] || {};
        // missing check
        if (!variableMap.hasOwnProperty(name) && !stub.hasOwnProperty(A_DEFAULT)) {
            throw new Error(`missing variable ${name}.`);
        }

        // type match
        if (stub.type === T_FUNCTION && !isFunction(variableMap[name])) {
            throw new Error(`variable ${name} is not function as expected.`);
        }
    }
};

let getVariable = (name, variableMap, variableStub) => {
    let stub = variableStub[name] || {};
    let value = null;
    if (variableMap.hasOwnProperty(name)) {
        value = variableMap[name];
    } else {
        // try to using default
        if (!stub.hasOwnProperty(A_DEFAULT)) {
            throw new Error(`missing variable ${name}.`);
        } else {
            value = stub[A_DEFAULT];
        }
    }

    if (isObject(stub) && isFunction(stub.validate)) { // dynamic validation
        stub.validate(value);
    }

    return value;
};

let validateParamsInRunTime = (funName, paramValues, variableStub) => {
    let stub = variableStub[funName] || {};
    let validateParams = stub.validateParams;
    if (isFunction(validateParams)) {
        validateParams(paramValues);
    }
};

module.exports = {
    checkAST,
    runTimeCheck,
    getVariable,
    validateParamsInRunTime
};
