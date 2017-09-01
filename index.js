// make PFC as simple as possible
module.exports = require('./src');

/**
 *
 * @readme-quick-run
 *
 * ## test tar=js r_c=pfcCompiler
 *
 * let {parseStrToAst, executeAST} = pfcCompiler;
 *
 * let ast = parseStrToAst('f1(1, 2, g("234", v2))');
 *
 * let context = {
 *   f1: (a, b, c) => a + b + c,
 *   g: (str1, str2) => Number(str1 + str2),
 *   v2: "5"
 * };
 *
 * let ret = executeAST(ast, context);
 *
 * console.log(ret);
 */
