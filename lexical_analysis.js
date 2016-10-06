'use strict';

let lexical_analysis_expressions = [
  {
    expressions: [/(\/\*([^*]|[\r\n]|(\*+([^*\/]|[\r\n])))*\*+\/)|(\/\/.*)/g],
    description: "Comentário"  
  },
  {
    expressions: [/function ([^\(]+)/],
    description: "Nome de Função",
    callback: function(args) {
      if (args[1]) {
        console.log(args[1]);
      }
    }
  },
  {
    expressions: [/\(\s*([^)]+?)\s*\)/],
    description: null,
    callback: function(args) {
      if (args[1]) {
        args = args[1].split(/\s*,\s*/);
      }
      for (var i = 0; i< args.length; i++) {
        let arg_name = args[i].replace(/\W/g,"");        
        console.log(arg_name);
        console.log("Parâmetro");
      }
    }
  }  
];

module.exports = lexical_analysis_expressions;