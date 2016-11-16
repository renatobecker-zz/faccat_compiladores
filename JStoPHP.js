'use strict';

let esprima = require('esprima');
let fs = require('fs');
let parser = require('./lib/parser.js');

fs.readFile('fileToRead.js', 'utf8', (err, data) => {
  if (err) return err;
  //let tokenizeResult = esprima.tokenize(data);
  //console.log(tokenizeResult);
  let parseResult = esprima.parse(data);  
  let parserObj = new parser(parseResult, 'output/script.php');
  //parserObj.printTree(); 
  parserObj.saveFileLog();
  parserObj.create(); 
});

