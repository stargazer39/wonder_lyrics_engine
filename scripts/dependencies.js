$.mobileDevice = (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase()));
$.fn.mySHeight = function(){
	return this[0].getBoundingClientRect().height
};
$.fn.mySWidth = function(){
	return this[0].getBoundingClientRect().width
};
function ObjIncludes(obj,key){
	return (Object.keys(obj).includes(key)) ? obj[key] : false
}
function makeRequest(method, url) {
  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.onload = function () {
      if (this.status >= 200 && this.status < 300) {
        resolve(xhr.response);
      } else {
        reject({
          status: this.status,
          statusText: xhr.statusText
        });
      }
    };
    xhr.onerror = function () {
      reject({
        status: this.status,
        statusText: xhr.statusText
      });
    };
    xhr.send();
  });
}

function parseQuery( name, url ) {
    if (!url) url = location.href;
    name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
    var regexS = "[\\?&]"+name+"=([^&#]*)";
    var regex = new RegExp( regexS );
    var results = regex.exec( url );
    return results == null ? null : results[1];
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function interpret(data){
	//Loop will check the tags and work accordingly
	data = data.split("\n");
	var langr = {};
	var start = false;
	var tag;
	for (var j = 0; j < data.length; j++){
		//console.log(JSON.stringify(data[j]));
		//console.log(data[j]);
		data[j] = data[j].trim();
		if(data[j][0] == "[" || data[j][0]== "["){
			start = true;
			var k = 0;
			//console.log(data[j]);
			tag = data[j].slice(1,-1).split("-");
			//console.log(tag);
			switch(tag.length){
				case 1:
					langr[tag[0]] = {}
					break;
				case 2:
				if(!langr[tag[0]]){
					langr[tag[0]]= {}
				}
					langr[tag[0]][tag[1]] = {}
			}
			//console.log(tag);
		}
		if(start){
			//langr[tag][k] = data[j+1];
			switch(tag.length){
				case 1:
					//langr[tag[0]][k] = []
					langr[tag[0]][k] = data[j+1];
					break;
				case 2:
					//langr[tag[0]][tag[1]][k] = []
					langr[tag[0]][tag[1]][k] = data[j+1];
					break;
			}
			k++;
			if(data[j+2]){
				if(data[j+2].slice(0,1) == "["){
					start = false;
				}
			}else{
				start = false;
			}
		}
	}
	//console.log(langr);
	//return displayable lyrics
	return langr;
}
/*function process(array,seperator){
	console.log(Object.keys(array).length);
	var k = 0;
	var output = new Array();
	for (var j = 0; j < Object.keys(array).length; j++){
		if(array[j].slice(0,2) == "|-"){
			//console.log(array[j]);
			if (seperator == "lyrics") {
				output[k] = "<div class ='line line_space'></div>";
			}else{
				output[k] = seperator;
			}
			k++;
			//array[j] = "[skip]";
		}else if(array[j].slice(0,1) == "|"){
			if(seperator == "lyrics"){
				output[k] = "<div class = \'line\'>" + array[j].slice(1)  + "</div>";
			}else{
				output[k] = array[j].slice(1) + seperator;
			}
			k++;
		}
	}
	//console.log(output);
	return output;
}
*/
function processToHTML(lines){
	var html = []
	for(let line of lines){
		if(line == "-" ){
			html.push(`<div class="line line_space"></div>`)
		}else{
			html.push(`<div class="line">${line}</div>`)
		}
	}
	return html
}