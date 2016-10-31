'use strict';

let fs = require('fs');

const varAssignOperator  = " = ";
const spaceValue         = " ";
const endLineIdentifier  = ";";
const openBody           = " {";
const closeBody          = "\n}" + endLineIdentifier;
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
      this.addOutput(varOutput, true);
      console.log(varOutput);

    };
    this.variableDeclaration = function(obj) {
    	if (obj.declarations) {
        	this.process(obj.declarations);
    	};     
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
    	functionOutput += openBody;
    	this.addOutput(functionOutput, true);        
    	console.log(functionOutput);

        if ( (functionOutput) && (obj.body) && (obj.body.body) ) {      
              this.process( obj.body.body );
        } 

    	this.addOutput(closeBody, true);        
        console.log(closeBody);
    };    
    this.returnStatement = function(obj) {
      return 'return ';
    };
    this.expressionStatement = function(obj) {
    	if (obj.expression) {
    		if (obj.expression.type == "CallExpression") {
    			this.callExpression(obj.expression);
    		}
    	}
    };    
    this.binaryExpression = function(obj) {
        console.log("BinaryExpression");
    };            
    this.forStatement = function(obj) {
        let forOutput;
        if (obj.init.type == "AssignmentExpression") {
        	forOutput = this.assignmentExpression(obj.init);
        }
    };            
    this.assignmentExpression = function(obj) {

        console.log(obj);
    };                
    this.updateExpression = function(obj) {
        console.log("UpdateExpression");
    };                    
    this.whileStatement = function(obj) {
        console.log("WhileStatement");
    }; 
    this.callExpression = function(obj) {
    	let callOutupt;
    	let callType = obj.callee.name.toLowerCase();
    	if (callType == 'alert') {
    		let callCommand = "echo ";
    		if ( (obj.arguments) && (obj.arguments.length > 0) ) {
    			if (obj.arguments[0].type == "Identifier") {
    				callOutupt = callCommand + obj.arguments[0].name + endLineIdentifier;
    			} else if (obj.arguments[0].type == "Literal") {
    				callOutupt = callCommand + obj.arguments[0].raw + endLineIdentifier;
    			}
    		}	
    	}
    	this.addOutput(callOutupt);
    	console.log(callOutupt);
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
    this.operation = function(item) {
    	switch ( item.type  ) {
       		case "VariableDeclarator":
          		return this.variableDeclarator(item);
        	   	break;
        	case "VariableDeclaration":
           		return this.variableDeclaration(item);
            	break;
       		case "FunctionDeclaration":
           		return this.functionDeclaration(item);
	      		break;
	       	case "ExpressionStatement":
    	       	return this.expressionStatement(item);
        		break;
       		case "BinaryExpression":
          		return this.binaryExpression(item);
        		break;
	        case "ForStatement":
    	       	return this.forStatement(item);
    		   	break;
        	case "AssignmentExpression":
           		return this.assignmentExpression(item);
        		break;
	        case "UpdateExpression":
    	       	return this.updateExpression(item);
        	   	break;
        	case "WhileStatement":
            	return this.whileStatement(item);
            	break;
            case "ReturnStatement":
            	return this.returnStatement(item);
            	break;
		}    	
    };
    this.process = function(element) {

        for (let i = 0; i < element.length; i++) {
       		let item = element[i];
       		this.operation(item);
		}	

    };
    this.create = function() { 

        if (!this.tree) return;

        let body = this.tree.body;
        this.process(body);
        this.saveFile();

    };     
};