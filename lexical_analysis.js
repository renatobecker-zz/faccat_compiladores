'use strict';

let lexical_analysis_expressions = [
  {
    expressions: [/(\/\*([^*]|[\r\n]|(\*+([^*\/]|[\r\n])))*\*+\/)|(\/\/.*)/g],
    description: "Comentário"  
  }
];

module.exports = lexical_analysis_expressions;