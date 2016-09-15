'use strict';

let fs = require('fs');
let readline = require('readline');

let expressions = require('./expressions');
let messages = require('./messages');

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

  for (var exp in expressions) {
    var re = new RegExp(expressions[exp]);
    if (re.test(line)) {
      var name = (exp === 'function') ? getFunctionName(line) : '';
      console.log('Line ' + currentLine + ' ' + messages[exp] + name);    
    }  
  }

}

function getFunctionName(line) {
  var exp =  /^function\s+([\w\$]+)\s*\(/;
  var result = exp.exec( line.toString() );
  return  result  ?  '"' + result[ 1 ] + '"' :  ''    
}