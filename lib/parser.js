'use strict';

let fs = require('fs');

const varAssignOperator  = " = ";
const spaceValue         = " ";
const endLineIdentifier  = ";";
const openBody           = " {\n";
const closeBody          = "\n}";
const functionIdentifier = "function";
let output               = '<?php\n';

module.exports = function(obj, filename) {
    
    this.filename = filename;
    this.tree = obj;
    this.addOutput = function(value, linebreak) {
    	output += value;
    	if ( Boolean(linebreak) ) {
    		output += '\n'; 
    	}
    };    	
    this.variableDeclarator = function(obj) {
      let varOutput = `$${obj.id.name}`;
      if ( (obj.init) && (obj.init.type == "Literal") ) {
      	varOutput += varAssignOperator + obj.init.raw;
      }
      varOutput += endLineIdentifier;
      return varOutput;
    };
    this.variableDeclaration = function(obj) {
    	let varOutput = this.process(obj.declarations);
    	this.addOutput(varOutput, true);
    	console.log(varOutput);
    };
    this.functionDeclaration = function(obj) {
    	let functionOutput;
    	if (obj.id.type == "Identifier") {
    		functionOutput = functionIdentifier + spaceValue + obj.id.name;
    	}
    	if ( (functionOutput) && (obj.params) ) {
    		let paramsList = obj.params.map(function(param){
              return `$${param.name}`;
    		});
    		functionOutput += "(" + paramsList.join(', ') + ")";
    	}
        
        if ( (functionOutput) && (obj.body) && (obj.body.body) ) {      
          	let bodyOutput = [];
        	for (var i = 0; i < obj.body.body.length; i++) {
              bodyOutput.push( this.process(obj.body.body[i]) );
    		};
    		functionOutput += openBody + bodyOutput.join('\n') + closeBody;
        } 

    	this.addOutput(functionOutput, true);
        console.log(functionOutput);
    };    
    this.returnStatement = function(obj) {
      return 'return ';
    };
    this.expressionStatement = function(obj) {
        console.log("ExpressionStatement");
    };    
    this.binaryExpression = function(obj) {
        console.log("BinaryExpression");
    };            
    this.forStatement = function(obj) {
        console.log("ForStatement");
    };            
    this.assignmentExpression = function(obj) {
        console.log("AssignmentExpression");
    };                
    this.updateExpression = function(obj) {
        console.log("UpdateExpression");
    };                    
    this.whileStatement = function(obj) {
        console.log("WhileStatement");
    }; 
    this.saveFileLog = function() {

  	  let arrayObj = this.tree;
      let stringObj = JSON.stringify(arrayObj, null, '  '); 
      fs.writeFile("output/parser.log", stringObj, function(err) {
        if(err) return console.log(err);
      }); 
    },
    this.saveFile = function() {

      fs.writeFile(this.filename , output, function(err) {
        if(err) return console.log(err);
      }); 
    },
    this.printTree = function() {

  	  let arrayObj = [this.tree];
      let stringObj = JSON.stringify(arrayObj, null, '  '); 
      console.log(stringObj);
    };
    this.process = function(element) {

        for (let i = 0; i < element.length; i++) {
       		let item = element[i];
    		switch ( item.type  ) {
        		case "VariableDeclarator":
           			return this.variableDeclarator(item);
        	    	break;
        		case "VariableDeclaration":
           			this.variableDeclaration(item);
        	    	break;
        		case "FunctionDeclaration":
            		this.functionDeclaration(item);
	       			break;
	       		case "ExpressionStatement":
    	        	this.expressionStatement(item);
        			break;
        		case "BinaryExpression":
           			this.binaryExpression(item);
        			break;
	        	case "ForStatement":
    	       		this.forStatement(item);
    		   		break;
        		case "AssignmentExpression":
           			this.assignmentExpression(item);
        			break;
	        	case "UpdateExpression":
    	       		this.updateExpression(item);
        	   		break;
        		case "WhileStatement":
            		this.whileStatement(item);
            		break;
            	case "ReturnStatement":
            		this.returnStatement(item);
            		break;
			}
		}	
    };
    this.create = function() { 

        if (!this.tree) return;

        let body = this.tree.body;
        this.process(body);
        this.saveFile();
    };     
};