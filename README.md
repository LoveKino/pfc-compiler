# pfc-compiler

[中文文档](./README_zh.md)   [document](./README.md)

A compiler for PFC grammer
- [install](#install)
- [usage](#usage)
  * [API quick run](#api-quick-run)
- [develop](#develop)
  * [file structure](#file-structure)
  * [run tests](#run-tests)
- [license](#license)

## install

`npm i pfc-compiler --save` or `npm i pfc-compiler --save-dev`

Install on global, using `npm i pfc-compiler -g`



## usage








### API quick run



```js
let pfcCompiler = require('pfc-compiler')
let {parseStrToAst, executeAST} = pfcCompiler;

let ast = parseStrToAst('f1(1, 2, g("234", v2))');

let context = {
  f1: (a, b, c) => a + b + c,
  g: (str1, str2) => Number(str1 + str2),
  v2: "5"
};

let ret = executeAST(ast, context);

console.log(ret);
```

```
output

    2348

```


## develop

### file structure

```
.    
│──LICENSE    
│──README.md    
│──README_zh.md    
│──TODO.md    
│──build    
│   └──index.js    
│──coverage    
│   │──coverage.json    
│   │──lcov-report    
│   │   │──base.css    
│   │   │──index.html    
│   │   │──pfc-compiler    
│   │   │   │──grammer    
│   │   │   │   │──index.html    
│   │   │   │   └──tokenTypes.js.html    
│   │   │   │──index.html    
│   │   │   └──index.js.html    
│   │   │──prettify.css    
│   │   │──prettify.js    
│   │   │──sort-arrow-sprite.png    
│   │   └──sorter.js    
│   └──lcov.info    
│──grammer    
│   │──grammer.txt    
│   └──tokenTypes.js    
│──index.js    
│──lib    
│   └──stubAsApis.js    
│──package.json    
└──res    
    └──lr1Table.js     
```


### run tests

`npm test`

## license

MIT License

Copyright (c) 2017 chenjunyu

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
