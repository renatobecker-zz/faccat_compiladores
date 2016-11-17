'use strict';

let esprima = require('esprima');
let fs = require('fs');
let parser = require('./lib/parser.js');

fs.readFile('fileToRead.js', 'utf8', (err, data) => {
  if (err) return err;
  //let tokenizeResult = esprima.tokenize(data);
  //console.log(tokenizeResult);
  
  try {
    let parseResult = esprima.parse(data, {tolerant: true});      
    let parserObj = new parser(parseResult, 'output/script.php');
  //parserObj.printTree(); 
  parserObj.saveFileLog();
  parserObj.create(); 

}
catch(e) {
    console.log(JSON.stringify(e));
    fs.writeFile("output/error.log", e, function(err) {
        if(err) return console.log(err);
    });    
}

});

