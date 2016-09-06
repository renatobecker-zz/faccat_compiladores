max = function(a) {
    var m = a[0];
    for (var i = 1; i < a.length; i++) {
        writeln("m = "+m);
	if (m < a[i]) m = a[i];
    }
    return m;
}

impar = function(v) {
    if(v & 1){
        writeln("Impar");
    } else {
        writeln("Par");
    }
}

a = random_list(6,1,10);
writeln(a);
max(a);
impar(4);
impar(5);