'use strict';

let tokens = [
  {
  	name: "",
    expressions: /[(]*[a-zA-Z0-9_]+ *([-+*/] *[a-zA-Z0-9_]+ *[)]*)+| *[a-zA-Z0-9_]+[-+]+/g,
    description: "Operação Matematica"
  },
  {
  	name: "",  	
    expressions: /[a-zA-Z]+ *[=] *[a-zA-Z0-9]+|[a-zA-Z]+ *[+]+[=] *[a-zA-Z0-9]+/g,
    description: "Atribuicao de Valor"
  },
  {
  	name: "",  	
    expressions: /(\/\*([^*]|[\r\n]|(\*+([^*\/]|[\r\n])))*\*+\/)|(\/\/.*)/g,
    description: "Comentario"  
  },
  {
  	name: "",  	
    expressions: /function ([^\(]+)/,
    description: "Nome de Funcao"
  },
  {
  	name: "",  	
    expressions: /^(?!function).*([a-zA-Z0-9]+)\(([^()]*|\([^()]*\))*\)/g,
    description: "Chamada de Funcao"
  },
  {
  	name: "",  	
    expressions: /function\s+([\w\$]+)\s*\(\s*([^)]+?)\s*\)\s*{/,
    description: "Declaração de Funcao"
  }  
];

function run(source) {
	//console.log(source);
	for (let i = 0; i < tokens.length; i++) {
		let result = source.match(tokens[i].expressions);      	
		if (result) {
			console.log(tokens[i].description);
			for (let j = 0; j < result.length; j++) {
				console.log(result[j]);
			}
		}
		//console.log(result);
	}
}



module.exports = run;
