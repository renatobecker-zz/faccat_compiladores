'use strict';

let fs = require('fs');
let readline = require('readline');
let lexer = require('./lib/lexer');
/*
let messages = require('./messages');
let reserved_words = require('./reserved_words');
let lexical_analysis = require('./lexical_analysis');
*/

function isValidFileExtension(filename) {
	let check_name = filename.toLowerCase();
  	return check_name.match(/(\.php)$/);
}

function convert_file(filename, callback) {
	let rd = readline.createInterface({
  		input: fs.createReadStream(filename),
  		output: process.stdout,
  		terminal: false
	});
    
    let currentLine = 1;
	rd.on('line', (line) => {
		if (callback) {
			callback(line);
		}
  		currentLine++;
	});
}

function init_process() {
	let args = process.argv.slice(2);
	for (let i = 0; i < args.length; i++) {

		let filename = args[i];
		if (!isValidFileExtension(filename)) {
			console.log("Invalid file extension: " + filename);
		} else {
			fs.readFile(filename, function(err, data) {
    			if(err) throw err;
    			lexer(data.toString());
				//console.log(data.toString());		
			});			
		}		
		//convert_file(filename, process_line);
	}
}

function process_line(line) {
	console.log(line);
}

init_process();