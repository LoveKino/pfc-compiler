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

let getProductionId = (production) => {
    return `${production[0]} := ${production[1].join(' ')}`;
};

let isFunction = (v) => typeof v === 'function';

let isObject = (v) => v && typeof v === 'object';

module.exports = {
    processTokens,
    getProductionId,
    isFunction,
    isObject
};
