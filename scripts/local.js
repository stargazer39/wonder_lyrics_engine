//Animation for Intro
var intro = document.getElementById('intro');
var waiting = document.getElementById('waiting');
var startshow = document.getElementById('startshow');
var playalt = document.getElementsByClassName("playalt")

//Animation for controls
var settings = document.getElementById('settings');
var controls = document.getElementById('controls');

controls.addEventListener('mouseout',function(){ controls.classList.remove("anisettings")});
controls.addEventListener('mouseover',function(){ controls.classList.add("anisettings")});
settings.addEventListener('mouseover',function(){ controls.classList.add("anisettings")});
//settings.addEventListener('mouseout',function(){ controls.classList.remove("anisettings")});

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

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

//Ainmation
var begin = false;
async function animation1(){
	if(!begin){
		intro.classList.add("introanim");
		await sleep(1000);
		intro.classList.add("disnone");
		begin = true;
		}
}

//The Engine Starts Here
var display = document.getElementById("lyrics");
var display2 = document.getElementById("display2");
var player = document.getElementById("player");

var wholepage = document.querySelectorAll(".bottom,#lyrics,#display2,#display,#overlay,#overlay2");
for (var child of wholepage) {
  child.classList.add("fadeout");
  child.classList.add("fadetrans");
}

var romaji;
var rsplit;
var lsplit;
var time,tsplit;

var slider0;
var control_return = [];
var seeking = false;
var alter;
function playerBegin() {
	//Seeker seeker
	player.oncanplay = function() {
	   	//seeker.max = player.duration;
	   	slider0 = new Slider("element0",{ 
			'min' : 0,
			'max' : player.duration,
			'rate' : 1000
		});
	   	waiting.classList.add("fadeout");
		startshow.classList.add("fadein");
	};
	var i = 0,sync = 0,y = -36,fade = true;
	var done;
	console.log(tsplit[tsplit.length - 1]);
	var k = 0;
	function update() {
		//console.log(player.currentTime);
		//Seeker's Stuff
		console.log(Math.floor(player.currentTime)%2)
		if(!seeking && (Math.floor(player.currentTime)%2) == k){
			slider0.slider_update(player.currentTime);
			if(k==0){
				k=1;
			}else{
				k=0;
			}
		}
		if(player.currentTime < tsplit[0] || player.currentTime > tsplit[tsplit.length - 1]){
			for (var child of wholepage) {
				  child.classList.add("fadeout");
				}
		}
		if(player.currentTime + sync > tsplit[i] && player.currentTime + sync < tsplit[i+1]){
			//display.classList.remove("fadeout");

			if(rsplit[i] == "<br>"){
				for (var child of wholepage) {
				  child.classList.add("fadeout");
				}
			}
			if(!(rsplit[i] == "<br>")){
				for (var child of wholepage) {
				  child.classList.remove("fadeout");
				}
			}
			y = -36 - (72*i);
			display.style.transform = "translate(-50%," + y + "px)";
			//display.innerHTML = rsplit[i];
			display2.innerHTML = lsplit[i]
			console.log(player.currentTime + 'in');
			console.log(i + '###############');
			i++;
		}
	}

	var updater;
	var interval = true;

	function start(){
		if(interval){
			updater = setInterval(update,10);
			interval = false;
		}
	}
	function stop(){
		if(!interval){
			clearInterval(updater); 
			interval = true;
		}
	}

	player.addEventListener("seeked", async function() {seek(); start();player.play();});
	player.addEventListener("play",function() {seek(); start(); animation1();});
	player.addEventListener("pause",function(){stop();});
	player.addEventListener("ended",function(){ console.log("ended"); stop();});
	
	playalt[0].addEventListener("click",function(){player.play();});

	var seek = function(){
		done = false;
		//player.pause();
		tsplit.forEach(check);
		//player.play();
	}
	control_return[0] = seek;
	function check(item,index) {
		if(item > player.currentTime + sync && !done){
			console.log(index);
			i = index - 1;
			if(i<0){
				i=0;
			}
			done = true;
		}
	}
	document.addEventListener('keydown', function (event) {
	  if (event.key === ' ') {
	  	if(player.paused){
	  		player.play();
	  	}else{
	  		player.pause();
	  	}
	  }
	});
}
 function slider_mousedown(id){
	seeking = true;
	console.log("down");
}
function slider_mouseup(id){ 
	seeking =false;
	console.log("up")
	player.currentTime = slider0.slider_get();
	control_return[0]();
}
function processLyrics(data){
	//Loop will check the tags and work accordingly
	data = data.split("\n");
	var langr = {};
	var start = false;
	var tag;
	for (var j = 0; j < data.length; j++){
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
	//return displayable lyrics
	return langr;
}

function lyricsArrary(array,seperator){
	console.log(Object.keys(array).length);
	var k = 0;
	var output = new Array();
	for (var j = 0; j < Object.keys(array).length; j++){
		if(array[j].slice(0,2) == "|-"){
			//console.log(array[j]);
			output[k] = seperator;
			k++;
			//array[j] = "[skip]";
		}else if(array[j].slice(0,1) == "|"){
			output[k] = array[j].slice(1) + seperator;
			k++;
		}
	}
	//console.log(output);
	return output;
}
//Begin the main programm
async function mainFunction() {
	let response = await makeRequest('GET', 'http://localhost:8080/');
	var data = processLyrics(response);
	console.log(data);
	rsplit = lyricsArrary(data["lyrics"]["romaji"],"<br>");
	lsplit = lyricsArrary(data["lyrics"]["english"],"<br>");
	tsplit = lyricsArrary(data["time"],"");

	for (var j = 0; j < rsplit.length; j++)
	{
		//console.log(data[j]);
		display.innerHTML += rsplit[j];
	}
	var source = document.createElement('source');
	source.setAttribute('src',lyricsArrary(data["localfile"],""));
	player.appendChild(source);
	playerBegin();
}
mainFunction();
