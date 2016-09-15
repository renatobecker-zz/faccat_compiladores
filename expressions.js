'use strict';

let expressions = {
  function: /function +[a-zA-Z0-9_]+\(([^()]*|\([^()]*\))*\)/g,
  operators: /[(]*[a-zA-Z0-9_]+ *[-+*/] *[a-zA-Z0-9_]+ *[)]*| *[-+*/] *[a-zA-Z0-9_]+/g,
  assign: /[a-zA-Z]+ *[=] *[a-zA-Z0-9]+|[a-zA-Z]+ *[+]+[=] *[a-zA-Z0-9]+/g,
  close: /[}]/g, // TODO needs fix in order to work with ES6 template literals ``
  forloop: /for +\(([^()]*|\([^()]*\))*\)/g,
  whileloop: /while +\(([^()]*|\([^()]*\))*\)/g,
  conditional: /if +\(([^()]*|\([^()]*\))*\)/g,
  functionCall: /^(?!function).*([a-zA-Z0-9]+)\(([^()]*|\([^()]*\))*\)/g,
  return: 'return',
  write: 'console.log'
};

module.exports = expressions;