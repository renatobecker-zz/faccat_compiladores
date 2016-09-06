function readText(fileName) {
    if (fileName) {
		var r = new FileReader();
		r.onload = function(e) { 
			var contents = e.target.result;
				alert( "Got the file.n" 
					+"name: " + f.name + "n"
					+"type: " + f.type + "n"
					+"size: " + f.size + " bytesn"
					+ "starts with: " + contents.substr(1, contents.indexOf("n"))
				);  
		}
		r.readAsText(fileName);
	} else { 
		alert("Failed to load file");
    }
}	