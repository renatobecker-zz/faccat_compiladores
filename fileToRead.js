var appName  = "Faccat Compiladores";
var print = "print source code";

function teste() {
  var x = 1;
  alert(x);
  alert("alert string");
  alert("teste" + " concatenação");
  alert(appName);
}

teste();
alert('teste');

let oper;
var calc = 1 + 3 * 22 / 4;
let ok = "print ok";

for (i = 0; i < 5; i++) {
	//comentário no FOR
	if ((i === 2) || (i === 4)) break; 
    console.log("The number is " + i);
}

var total = 4;
while (total > 0) {
  total--;
}

function calcular(val1, val2) {
	return val1 * val2 + 6;
}

calcular(2,4);

function notToDo() {
	return;
}