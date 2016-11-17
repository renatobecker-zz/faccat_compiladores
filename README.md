# FACCAT Compiladores
Tarefa da disciplina Compiladores 2016/2-Faccat

## Objetivo
Criar um programa que converta códigos Javascript para PHP.

## Identificação de tokens
Para a identificação de tokens, usa-se a biblioteca Esprima. 
Inicia-se o programa com o input de um arquivo JS, então a biblioteca faz a análise léxica e cria a árvore de tokens.
Após termos os tokens devidamente identificados, inicia-se o processo de processamento.
Nesse processo, verificamos o tipo de cada token e inicia-se a tradução do código. 


## Funcionalidades suportadas
Atualmente, nosso programa suporta as seguintes funcionalidades:

    - Declaração de variáveis
    - Declaração de funções
    - Expressões
    - Expressões Binárias
    - Foor loops
    - While loops
    - Atribuição de valores
    - Condições(if/else)
    - Retorno de valores
    
## Show time!
Arquivo JS que deve ser traduzido: [fileToRead.js](https://github.com/renatobecker/faccat_compiladores/blob/master/fileToRead.js)
