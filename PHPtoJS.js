'use strict';
let parser = require('php-parser');
let fs = require('fs');
let readline = require('readline');

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
				console.log(AST);//.toString());
			});			
		}		
	}
}

init_process();