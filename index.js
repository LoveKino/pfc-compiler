// make PFC as simple as possible
module.exports = require('./src');

/**
 *
 * @readme-quick-run
 *
 * ## test tar=js r_c=pfcCompiler
 *
 * let {compile} = pfcCompiler;
 * let translate = compile('f1(1, 2, g("234", v2))');
 *
 * let ret = translate({
 *   f1: (a, b, c) => a + b + c,
 *   g: (str1, str2) => Number(str1 + str2),
 *   v2: "5"
 * })();
 *
 * console.log(ret);
 */
