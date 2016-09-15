function getType(data) {
  return typeof data;
}

function showUsers(users) {
  for (let i = 0; i < users.length; i++) {
    if (users[i] === 'Fernando') {
      console.log(`Woahhh, you found it!`);
  	}
  }
}

function sum(a, b) {
  let data = a + b
  return data;
}

function ateParar(value) {
  var i = 0;
  while (i < value) {
  	i++;
  }
  console.log('ateParar chegou em ' + value);
}

let type = getType('disciplina de compiladores');

console.log(type);

showUsers(['Leonardo', 'Renato', 'Fernando', 'Delmar', 'Marcelo']);
ateParar(40);