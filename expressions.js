'use strict';

let expressions = {
  function: 'function +[a-zA-Z0-9_]+\(([^()]*|\([^()]*\))*\)',
  operators: '[(]*[a-zA-Z0-9_]+ *[-+*/] *[a-zA-Z0-9_]+ *[)]*| *[-+*/] *[a-zA-Z0-9_]+',
  assign: '[a-zA-Z]+ *[=] *[a-zA-Z0-9]+|[a-zA-Z]+ *[+]+[=] *[a-zA-Z0-9]+',
  close: '[}]', // TODO needs fix in order to work with ES6 template literals ``
  forloop: 'for +\(([^()]*|\([^()]*\))*\) *{',
  conditional: 'if +\(([^()]*|\([^()]*\))*\) *{',
  // functionCall: '[a-zA-Z0-9_]+\(([^()]*|\([^()]*\))*\)',
  findFunctionName: /^function\s+([\w\$]+)\s*\(/,
  return: 'return',
  write: 'console.log'
};

module.exports = expressions;