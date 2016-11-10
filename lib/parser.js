'use strict';

let fs = require('fs');

let callTypes = {
	"alert" : {
		output: "echo",
		useParentheses: false,
		scopeAlias: ""
	},
	"console.log" : {
		output: "print_r",
		useParentheses: true,
		scopeAlias: ""
	}			
};
const expressionList     = ["BinaryExpression", "AssignmentExpression"];
const varAssignOperator  = " = ";
const spaceValue         = " ";
const endLineIdentifier  = ";";
const openBody           = " {";
const closeBody          = "};"
const functionIdentifier = "function";
const forIdentifier      = "for";
let output               = '<?php\n';

module.exports = function(obj, filename) {  
    this.filename = filename;
    this.tree = obj;
    this.addEndOfLine = function(line) {
    	if (line !== "") {
    		return line += endLineIdentifier;
    	}
    };
    this.addOutput = function(value) {
    	output += value + '\n';
    	console.log(value);
    };
    this.getMemberExpressionDeclaration = function(obj) {
    	return obj.object.name + "." + obj.property.name;
    };  	
    this.variableDeclarator = function(obj) {
      let varOutput = `$${obj.id.name}`;
      if ( obj.init ) {
      	varOutput += varAssignOperator + this.objValue( obj.init );
      }
      this.addOutput(varOutput);
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
    	this.addOutput(functionOutput);        

        if ( (functionOutput) && (obj.body) && (obj.body.body) ) {      
              this.process( obj.body.body );
        } 
    	this.addOutput(closeBody);         	
    };    
    this.returnStatement = function(obj) {
    	let returnOutput = "return";
    	if ( (obj) && (obj.argument) ) {
    		returnOutput += spaceValue + this.operation( obj.argument );
    	}
    	returnOutput += endLineIdentifier;

    	this.addOutput(returnOutput);         	
    };
    this.expressionStatement = function(obj) {
    	if (obj.expression) {
    		if (obj.expression.type == "CallExpression") {
    			this.callExpression(obj.expression);
    		}
    	}
    };  
    this.processExpression = function(obj) {
    	let leftValue = (expressionList.indexOf(obj.left.type) > -1) ? this.processExpression(obj.left) : this.objValue(obj.left);
    	let rightValue = (expressionList.indexOf(obj.right.type) > -1) ? this.processExpression(obj.right) : this.objValue(obj.right);
    	let processExpression =  leftValue + " " + obj.operator + " " + rightValue;
		return processExpression;        
    }; 
    this.ifStatement = function(obj) {
    	let ifOutput;

    	return ifOutput;
    };
    this.forStatement = function(obj) {
        let forOutput, initExp, testExp, updateExp;
        if (obj.init) {
        	initExp = this.processExpression(obj.init) + endLineIdentifier;
        }
        if (obj.test) {
        	testExp = this.processExpression(obj.test) + endLineIdentifier;
        }
        if (obj.update) {
        	updateExp = this.updateExpression(obj.update);        	
        }
    	forOutput = forIdentifier + "(" + initExp + testExp + updateExp + ")" + openBody;
    	this.addOutput(forOutput);        
    	
        if ( (obj.body) && (obj.body.body) ) {   
            this.process( obj.body.body );
        } 		
    	this.addOutput(closeBody);         	

    };            
    this.updateExpression = function(obj) {
    	let updateOutput = this.objValue(obj.argument) + obj.operator;
    	return updateOutput;    
    };                    
    this.whileStatement = function(obj) {
        console.log("WhileStatement");
    }; 
    this.callExpression = function(obj) {
    	let callOutupt;
    	let callName = (obj.callee.type === "MemberExpression") ? this.getMemberExpressionDeclaration(obj.callee) : obj.callee.name.toLowerCase();
        let callArgs = this.processArguments(obj.arguments);    	
   		callOutupt = this.prepareCallStatement(callName, callArgs);
    	this.addOutput(callOutupt);
    }; 
    this.prepareCallStatement = function(call, args) {
    	let defaultConfig = {
    		output: call,
    		useParentheses: true,
    		scopeAlias: "$this->"
    	};

    	let callConfig = callTypes[call] || defaultConfig;
    	let callOutput = callConfig.scopeAlias + callConfig.output;
    	let callArgs   = args;
    	if (callConfig.useParentheses) {
    		callOutput += "(" + callArgs + ")";
    	} else {
    		callOutput += " " + callArgs;
    	}
    	return callOutput;
    };
    this.objValue = function(obj) {
    	let objOutput;
    	if (expressionList.indexOf(obj.type) > -1) {
    		objOutput = this.processExpression(obj);	
    	} else if (obj.type == 'Literal') {
    		objOutput = obj.raw;
    	} else if (obj.type == 'Identifier') {
    		objOutput = "$" + obj.name;
    	}
    	return objOutput;
    };
    this.processArguments = function(args) {
    	let argsOutput;
    	let argList = [];
    	if ( (args) && (args.length > 0) ) {
	        for (let i = 0; i < args.length; i++) {
	        	argList.push(this.objValue(args[i]));
    		};
    	}
    	argsOutput = argList.join(', ');
    	return argsOutput;
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
          		return this.processExpression(item);
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
            case "IfStatement":
            	return this.ifStatement(item);
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