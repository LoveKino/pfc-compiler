'use strict';

let streamTokenSpliter = require('stream-token-parser');

let {
    LR
} = require('syntaxer');

let {
    ACTION, GOTO
} = require('../res/lr1Table');

let tokenTypes = require('../grammer/tokenTypes');

// ignore whitespace
let processTokens = (rawTokens) => {
    let tokens = [];
    for (let i = 0; i < rawTokens.length; i++) {
        let {
            text, tokenType
        } = rawTokens[i];

        let name = tokenType.name;

        if (name !== 'whitespace') { // ignore white space
            tokens.push({
                text,
                name
            });
        }
    }

    return tokens;
};

let parser = () => {
    let tokenSpliter = streamTokenSpliter.parser(tokenTypes);

    let lrParse = LR(ACTION, GOTO, {
        // when reduce prodcution, translate at the sametime
        reduceHandler: (production, midNode) => {
            switch (getProductionId(production)) {
                case 'PROGRAM := EXPRESSION':
                    midNode.value = midNode.children[0].value;
                    break;
                case 'EXPRESSION := variable':
                    var v1 = midNode.children[0].token.text;
                    midNode.value = {
                        type: 'variable',
                        name: v1
                    };
                    break;
                case 'EXPRESSION := true':
                    midNode.value = {
                        type: 'atom',
                        value: true
                    };
                    break;
                case 'EXPRESSION := false':
                    midNode.value = {
                        type: 'atom',
                        value: false
                    };
                    break;
                case 'EXPRESSION := null':
                    midNode.value = {
                        type: 'atom',
                        value: null
                    };
                    break;
                case 'EXPRESSION := string':
                    var text = midNode.children[0].token.text;
                    midNode.value = {
                        type: 'atom',
                        value: text.substring(1, text.length - 1)
                    };
                    break;
                case 'EXPRESSION := number':
                    var numText = midNode.children[0].token.text;
                    midNode.value = {
                        type: 'atom',
                        value: Number(numText)
                    };
                    break;
                case 'EXPRESSION := variable ( )':
                    var f1Text = midNode.children[0].token.text;
                    midNode.value = {
                        type: 'function',
                        name: f1Text,
                        params: []
                    };
                    break;
                case 'EXPRESSION := variable ( EXP_LIST )':
                    var f2Text = midNode.children[0].token.text;
                    midNode.value = {
                        type: 'function',
                        name: f2Text,
                        params: midNode.children[2].value
                    };
                    break;
                case 'EXP_LIST := EXPRESSION':
                    midNode.value = [midNode.children[0].value];
                    break;
                case 'EXP_LIST := EXPRESSION , EXP_LIST':
                    midNode.value = [midNode.children[0].value].concat(midNode.children[2].value);
                    break;
            }
        }
    });

    // handle chunk data
    return (chunk) => {
        let str = chunk && chunk.toString();
        let tokens = processTokens(tokenSpliter(str));

        for (let i = 0; i < tokens.length; i++) {
            lrParse(tokens[i]);
        }

        // means finished chunks
        if (chunk === null) {
            let ast = lrParse(null);
            return ast.children[0].value;
        }
    };
};

// static check
let checkASTWithContext = (mid, variableMap) => {
    variableMap = variableMap || {};
    let stack = [mid];

    while (stack.length) {
        let top = stack.pop();
        let midType = top.type;

        if (midType === 'variable') {
            let varName = top.name;
            if (!variableMap.hasOwnProperty(varName)) {
                throw new Error(`missing variable ${varName}`);
            }
        } else if (midType === 'function') { // function
            let name = top.name;
            let fun = variableMap[name];
            if (!fun || typeof fun !== 'function') {
                throw new Error(`missing function ${name}, please check your variable map. Current variable map has keys [${Object.keys(variableMap).join(', ')}].`);
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

let translate = (mid, variableMap) => {
    variableMap = variableMap || {};
    checkASTWithContext(mid, variableMap);

    return () => {
        return executeAST(mid, variableMap);
    };
};

let executeAST = (mid, variableMap) => {
    let root = {
        mid
    };
    let stack = [root],
        traceTable = [];

    while (stack.length) {
        let top = stack[stack.length - 1];
        let topMid = top.mid;
        let midType = topMid.type;

        if (midType === 'atom') {
            top.value = topMid.value;
            traceTable.push(stack.pop());
        } else if (midType === 'variable') {
            let varName = topMid.name;

            top.value = variableMap[varName];
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
                let fun = variableMap[name];

                let paramValues = [];
                let paramLen = topMid.params.length;
                let traceTableLen = traceTable.length;
                let stopPos = traceTableLen - paramLen;
                for (let i = traceTableLen - 1; i >= stopPos; i--) {
                    paramValues.push(traceTable.pop().value);
                }
                top.value = fun(...paramValues);

                traceTable.push(stack.pop());
            }
        }
    }

    return root.value;
};

let compile = (str) => {
    let mid = parseStrToAst(str);
    return (variableMap) => translate(mid, variableMap);
};

let parseStrToAst = (str) => {
    let handleChunk = parser();
    if (str) {
        handleChunk(str);
    }
    return handleChunk(null);
};

let getProductionId = (production) => {
    return `${production[0]} := ${production[1].join(' ')}`;
};

module.exports = {
    parser,
    compile,
    translate,
    parseStrToAst,
    executeAST,
    checkASTWithContext
};
