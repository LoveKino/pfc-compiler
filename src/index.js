'use strict';

let {
    T_VARIABLE,
    T_ATOM
} = require('./const');
let {
    checkAST,
    runTimeCheck,
    getVariable,
    validateParamsInRunTime
} = require('./stub');

let parser = require('./parser');

let executeAST = (mid, variableMap = {}, {
    variableStub = {},
    skipCheck
} = {}) => {
    if (!skipCheck) {
        runTimeCheck(variableStub, variableMap);
    }

    let root = {
        mid
    };
    let stack = [root],
        traceTable = [];

    while (stack.length) {
        let top = stack[stack.length - 1];
        let topMid = top.mid;
        let midType = topMid.type;

        if (midType === T_ATOM) {
            top.value = topMid.value;
            traceTable.push(stack.pop());
        } else if (midType === T_VARIABLE) {
            top.value = getVariable(topMid.name, variableMap, variableStub);
            traceTable.push(stack.pop());
        } else { // function
            if (!top.visited) {
                top.visited = true;
                // push params
                let params = topMid.params;
                let paramLen = params.length;
                for (let i = 0; i < paramLen; i++) {
                    stack.push({
                        mid: params[i]
                    });
                }
            } else {
                let name = topMid.name;
                let fun = getVariable(name, variableMap, variableStub);

                // fetch params
                let paramValues = [];
                let paramLen = topMid.params.length;
                let traceTableLen = traceTable.length;
                let stopPos = traceTableLen - paramLen;
                for (let i = traceTableLen - 1; i >= stopPos; i--) {
                    paramValues.push(traceTable.pop().value);
                }

                // validate params before run function
                validateParamsInRunTime(name, paramValues, variableStub);

                // run function
                top.value = fun(...paramValues);

                traceTable.push(stack.pop());
            }
        }
    }

    return root.value;
};

let parseStrToAst = (str) => {
    let handleChunk = parser();
    if (str) {
        handleChunk(str);
    }
    return handleChunk(null);
};

module.exports = {
    parser,
    parseStrToAst,
    executeAST,
    checkAST
};
