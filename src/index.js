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

let processer = () => {
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
                default:
                    throw new Error(`Unexpected production to reduce. ${JSON.stringify(production)}`);
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

let translate = (mid, variableMap) => {
    variableMap = variableMap || {};
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
            top.value = variableMap[topMid.name];
            traceTable.push(stack.pop());
        } else if (midType === 'function') {
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
                var name = topMid.name;
                var fun = variableMap[name];
                if (!fun || typeof fun !== 'function') {
                    throw new Error(`missing function ${name}, please check your variable map. Current variable map has keys [${Object.keys(variableMap).join(', ')}].`);
                }

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
    let handleChunk = processer();
    if (str) {
        handleChunk(str);
    }
    let mid = handleChunk(null);

    return (variableMap) => translate(mid, variableMap);
};

let getProductionId = (production) => {
    return `${production[0]} := ${production[1].join(' ')}`;
};

module.exports = {
    processer,
    compile,
    translate
};
