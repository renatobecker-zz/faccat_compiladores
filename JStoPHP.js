'use strict';

let esprima = require('esprima');
let fs = require('fs');
let parser = require('./lib/parser.js');

//const stdoutTokens = ["Numeric", "String"];

//let output = '<?php\n';

fs.readFile('fileToRead.js', 'utf8', (err, data) => {
  if (err) return err;
  /*
  let tokens = esprima.tokenize(data);
  let previousToken;

  // read all tokens and build the output
  for (let i = 0; i < tokens.length; i++) {
    let token = tokens[i];

    console.log(token);

    if (previousToken === 'lineBreaker') {
      output += '\n';
    }

    if (token.type === 'Keyword') {
      if (token.value === 'function') {
        output += 'function ';

        previousToken = 'function';
      }
      if (token.value === 'var') {
        previousToken = 'var';
      }
    }

    if (token.type === 'Identifier') {
      if (previousToken === 'var') {
        output += `$${token.value}`;
      }

      if (token.value === 'alert') {
        output += 'echo'
      }

      if (previousToken != 'var' && token.value != 'alert') {
        output += token.value;
      }

      previousToken = token.value;
    }

    if (token.type === 'Punctuator') {
      if (token.value === '{' || token.value === ';') {
        previousToken = 'lineBreaker';
      }

      output += `${token.value}`;
    }

    if (stdoutTokens.indexOf(token.type) > -1) {
      output += token.value;
    }
  }
  
  console.log(output);
  */  
  let parseResult = esprima.parse(data);  
  let parserObj = new parser(parseResult, 'output/script.php');
  //parserObj.printTree(); 
  parserObj.saveFile();
  parserObj.create(); 
});
