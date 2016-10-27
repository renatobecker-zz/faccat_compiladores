
'use strict';
let fs = require('fs');
let readline = require('readline');
let parser = require('php-parser');
let EOF = parser.lexer.EOF;
parser.lexer.mode_eval = false;
parser.lexer.all_tokens = true;

function isValidFileExtension(filename) {
	let check_name = filename.toLowerCase();
  	return check_name.match(/(\.php)$/);
}

function validateArgs() {
	let args = process.argv.slice(2);	
	return (args.length > 0);
}

function init_process() {
	let isValidArgs = validateArgs();
	if (isValidArgs == false) {
		console.log('Nenhum arquivo PHP informado.');
		return;	
	} 

	let args = process.argv.slice(2);
	for (let i = 0; i < args.length; i++) {

		let filename = args[i];
		if (!isValidFileExtension(filename)) {
			console.log("Invalid file extension: " + filename);
		} else {
			fs.readFile(filename, function(err, data) {
    			if(err) throw err;
                let AST = parser.parseEval(data.toString());				
				//console.log(AST);//.toString());
				
                parser.lexer.setInput(["<?php", data.toString()].join("\n"));
				let token = parser.lexer.lex() || EOF;
				let names = parser.tokens.values;
				while(token != EOF) {					
					if (names[token] != 'T_WHITESPACE') {
  						console.log(parser.lexer.yylineno, ':', names[token], '(', parser.lexer.yytext, ')');
  					}	
					token = parser.lexer.lex() || EOF;
  				}
			});			
		}		
	}
}
init_process();
/*

var engine = require('php-parser');
var EOF = engine.lexer.EOF;
engine.lexer.mode_eval = false;
engine.lexer.all_tokens = true;
engine.lexer.setInput(["<?php",
"class foo {",
"  public $bar;",
"  // a comment here ... but attached where ?",
"  const BAZ = '123';",
"  protected \$foobar = false;",
"  function __construct() {",
"  }",
"  private \$bam;",
"  public function getBam() {",
"    return \$this->bam;",
"  }",
"}"].join("\n"));
var token = engine.lexer.lex() || EOF;
var names = engine.tokens.values;
while(token != EOF) {
  console.log(engine.lexer.yylineno, ':', names[token], '(', engine.lexer.yytext, ')');
  token = engine.lexer.lex() || EOF;
}*/