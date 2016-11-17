'use strict';

let esprima = require('esprima');
let fs = require('fs');
let parser = require('./lib/parser.js');

fs.readFile('fileToRead.js', 'utf8', (err, data) => {
  if (err) return err;

  try {
    let parseResult = esprima.parse(data, {tolerant: true});
    let parserObj = new parser(parseResult, 'output/script.php');

    parserObj.saveFileLog();
    parserObj.create();
  }
  catch(e) {
    let errors = [
      'Porra, meu! Tu tá fazendo merda!',
      'Qualéqueé! Escreve isso direito!',
      '=(',
      'É muito amadorismo, não sabe nem escrever direito'
    ];
    let r = Math.floor(Math.random() * errors.length) + 0;

    console.log(errors[r]);
    console.log(`${e.description}`);
    console.log(`Please, check out line ${e.lineNumber}`);

    fs.writeFile("output/error.log", e, function(err) {
      if(err) return console.log(err);
    });
  }

});

