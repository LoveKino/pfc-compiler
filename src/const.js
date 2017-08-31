module.exports = {
    P_PROGRAM_0: 'PROGRAM := EXPRESSION',

    P_EXPRESSION_0: 'EXPRESSION := variable',
    P_EXPRESSION_1: 'EXPRESSION := true',
    P_EXPRESSION_2: 'EXPRESSION := false',
    P_EXPRESSION_3: 'EXPRESSION := null',
    P_EXPRESSION_4: 'EXPRESSION := string',
    P_EXPRESSION_5: 'EXPRESSION := number',
    P_EXPRESSION_6: 'EXPRESSION := variable ( )',
    P_EXPRESSION_7: 'EXPRESSION := variable ( EXP_LIST )',

    P_EXPRESSION_LIST_0: 'EXP_LIST := EXPRESSION',
    P_EXPRESSION_LIST_1: 'EXP_LIST := EXPRESSION , EXP_LIST',

    T_VARIABLE: 'variable',
    T_ATOM: 'atom',
    T_FUNCTION: 'function',

    A_DEFAULT: 'default'
};
