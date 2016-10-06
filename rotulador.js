'use strict';

let fs = require('fs');
let readline = require('readline');

let expressions = require('./expressions');
let messages = require('./messages');
let reserved_words = require('./reserved_words');
let lexical_analysis = require('./lexical_analysis');

let currentLine = 1;

let rd = readline.createInterface({
  input: fs.createReadStream('programa_fonte.js'),
  output: process.stdout,
  terminal: false
});

let numberPrinted;

rd.on('line', (line) => {
  getLineLabel(line);
  currentLine++;
});

function getLineLabel(line) {
  /*
  for (var exp in expressions) {
    if (line.match(expressions[exp])) { 
      let name = (exp === 'function') ? getFunctionName(line) : '';
      console.log('Line ' + currentLine);
      console.log(messages[exp] + name);    
    }  
  }*/
  verifyReservedWord(line);

  for (var analys in lexical_analysis) {
    verifyLexicalAnalysis(lexical_analysis[analys],line);            
  }       
}

function verifyReservedWord(line) {
  let re = /\b(do|if|in|for|let|new|try|var|case|else|enum|eval|null|this|true|void|with|await|break|catch|class|const|false|super|throw|while|yield|delete|export|import|public|return|static|switch|typeof|default|extends|finally|package|private|continue|debugger|function|arguments|interface|protected|implements|instanceof)/;
  let lexemas = line.match(/("[^"]+"|[^"\s]+)/g);
  for (var lex in lexemas) { 
    let lex_str = lexemas[lex].toLowerCase();           
    if (lex_str.match(re)) {
      printLine(line);
      console.log(lexemas[lex]);
      console.log("Palavra reservada");    
      console.log('Expressao Regular: ' + re);    
    }        
  }
}

function verifyLexicalAnalysis(obj, line) {
  if ((obj.expressions) && (obj.expressions.length > 0)) {
    for (var i = 0; i< obj.expressions.length; i++) {
      let result = line.match(obj.expressions[i]);
      if (result) {
        printLine(line);
        if (obj.callback) {
          obj.callback(result);
        }
        if (obj.description) console.log(obj.description);         
        console.log('Expressao Regular: ' + obj.expressions[i]);
        return;
      }
    }    
  } 
}

function printLine(line){
  if (numberPrinted !== currentLine){ 
    console.log();
    console.log('Line ' + currentLine);  
    console.log(line.trim());
    numberPrinted = currentLine;
  }  
}

function getFunctionName(line) {
  var exp =  /^function\s+([\w\$]+)\s*\(/;
  var result = exp.exec( line.toString() );
  return  result  ?  '"' + result[ 1 ] + '"' :  ''    
}