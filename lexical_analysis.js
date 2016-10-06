'use strict';

function print_params(args){
  for (var i = 0; i< args.length; i++) {
    let arg_name = args[i].replace(/\W/g,"");        
    console.log(arg_name);
    console.log("Parametro");
  }
}

let lexical_analysis_expressions = [
  {
    expressions: [/[(]*[a-zA-Z0-9_]+ *([-+*/] *[a-zA-Z0-9_]+ *[)]*)+| *[a-zA-Z0-9_]+[-+]+/g],
    description: "Operação Matematica",
    callback: function(args) {
        console.log(args[0]);
      }    
  },
  {
    expressions: [/[a-zA-Z]+ *[=] *[a-zA-Z0-9]+|[a-zA-Z]+ *[+]+[=] *[a-zA-Z0-9]+/g],
    description: "Atribuicao de Valor",
    callback: function(args) {
        console.log(args[0]);
      }
  },
  {
    expressions: [/(\/\*([^*]|[\r\n]|(\*+([^*\/]|[\r\n])))*\*+\/)|(\/\/.*)/g],
    description: "Comentario"  
  },
  {
    expressions: [/function ([^\(]+)/],
    description: "Nome de Funcao",
    callback: function(args) {
      if (args[1]) {
        console.log(args[1].trim());
      }
    }
  },
  {
    expressions: [/^(?!function).*([a-zA-Z0-9]+)\(([^()]*|\([^()]*\))*\)/g],
    description: "Chamada de Funcao"
  },
  {
    //expressions: [/\(\s*([^)]+?)\s*\)/],
    expressions: [/function\s+([\w\$]+)\s*\(\s*([^)]+?)\s*\)/],
    description: null,
    callback: function(args) {
      if ((args) && (args.length > 1)) {
        args = args[2].split(/\s*,\s*/);
      }
      for (var i = 0; i< args.length; i++) {
        let arg_name = args[i].replace(/\W/g,"");        
        console.log(arg_name);
        console.log("Parametro");
      }
    }
  }  
];

module.exports = lexical_analysis_expressions;