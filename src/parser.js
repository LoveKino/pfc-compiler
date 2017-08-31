let {
    processTokens,
    getProductionId
} = require('./util');
let streamTokenSpliter = require('stream-token-parser');
let {
    LR
} = require('syntaxer');
let {
    ACTION,
    GOTO
} = require('../res/lr1Table');
let tokenTypes = require('../grammer/tokenTypes');
let {
    P_PROGRAM_0,
    P_EXPRESSION_0,
    P_EXPRESSION_1,
    P_EXPRESSION_2,
    P_EXPRESSION_3,
    P_EXPRESSION_4,
    P_EXPRESSION_5,
    P_EXPRESSION_6,
    P_EXPRESSION_7,
    P_EXPRESSION_LIST_0,
    P_EXPRESSION_LIST_1,

    T_VARIABLE,
    T_ATOM,
    T_FUNCTION
} = require('./const');

module.exports = () => {
    let tokenSpliter = streamTokenSpliter.parser(tokenTypes);

    let lrParse = LR(ACTION, GOTO, {
        // when reduce prodcution, translate at the sametime
        reduceHandler: (production, midNode) => {
            switch (getProductionId(production)) {
                case P_PROGRAM_0:
                    midNode.value = midNode.children[0].value;
                    break;
                case P_EXPRESSION_0:
                    var v1 = midNode.children[0].token.text;
                    midNode.value = {
                        type: T_VARIABLE,
                        name: v1
                    };
                    break;
                case P_EXPRESSION_1:
                    midNode.value = {
                        type: T_ATOM,
                        value: true
                    };
                    break;
                case P_EXPRESSION_2:
                    midNode.value = {
                        type: T_ATOM,
                        value: false
                    };
                    break;
                case P_EXPRESSION_3:
                    midNode.value = {
                        type: T_ATOM,
                        value: null
                    };
                    break;
                case P_EXPRESSION_4:
                    var text = midNode.children[0].token.text;
                    midNode.value = {
                        type: T_ATOM,
                        value: text.substring(1, text.length - 1)
                    };
                    break;
                case P_EXPRESSION_5:
                    var numText = midNode.children[0].token.text;
                    midNode.value = {
                        type: T_ATOM,
                        value: Number(numText)
                    };
                    break;
                case P_EXPRESSION_6:
                    var f1Text = midNode.children[0].token.text;
                    midNode.value = {
                        type: T_FUNCTION,
                        name: f1Text,
                        params: []
                    };
                    break;
                case P_EXPRESSION_7:
                    var f2Text = midNode.children[0].token.text;
                    midNode.value = {
                        type: T_FUNCTION,
                        name: f2Text,
                        params: midNode.children[2].value
                    };
                    break;
                case P_EXPRESSION_LIST_0:
                    midNode.value = [midNode.children[0].value];
                    break;
                case P_EXPRESSION_LIST_1:
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

