'use strict';

let fs = require('fs');
let readline = require('readline');

let expressions = require('./expressions');

let currentLine = 1;

let rd = readline.createInterface({
  input: fs.createReadStream('programa_fonte.js'),
  output: process.stdout,
  terminal: false
});

rd.on('line', (line) => {
  getLineLabel(line);
  currentLine++;
});

function getLineLabel(line) {
  if (new RegExp(expressions.function).test(line)) {
    let name = getFunctionName(line);
    console.log(`Line ${currentLine} - Declaração de função ${name}`);
  }

  if (new RegExp(expressions.operators).test(line)) {
    console.log(`Line ${currentLine} - Operação matemática`);
  }

  if (new RegExp(expressions.assign).test(line)) {
    console.log(`Line ${currentLine} - Atribuição de valores a uma variável`);
  }

  if (new RegExp(expressions.close).test(line)) {
    console.log(`Line ${currentLine} - Fechamento de bloco de código`);
  }

  if (new RegExp(expressions.forloop).test(line)) {
    console.log(`Line ${currentLine} - Estrutura de controle de repetição`);
  }

  if (new RegExp(expressions.conditional).test(line)) {
    console.log(`Line ${currentLine} - Estrutura de controle condicional`);
  }

  if (new RegExp(expressions.return).test(line)) {
    console.log(`Line ${currentLine} - Retorno`);
  }

  if (new RegExp(expressions.write).test(line)) {
    console.log(`Line ${currentLine} - Escrita de dados`);
  }

  // if (new RegExp(expressions.functionCall).test(line)) {
  //   console.log(`Line ${currentLine} - Chamada de função`);
  // }
}

function getFunctionName(line) {
  var result = expressions.findFunctionName.exec( line.toString() )
  return  result  ?  result[ 1 ]  :  ''
}