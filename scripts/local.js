//Animation for Intro
var intro = document.getElementById('intro');
var waiting = document.getElementById('waiting');
var startshow = document.getElementById('startshow');
var playalt = document.getElementsByClassName("playalt")

//Animation for controls
var settings = document.getElementById('settings');
var controls = document.getElementById('controls');

//Control Panel lol
controls.addEventListener('mouseout',function(){ controls.classList.remove("anisettings")});
controls.addEventListener('mouseover',function(){ controls.classList.add("anisettings")});
settings.addEventListener('mouseover',function(){ controls.classList.add("anisettings")});

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

var wholepage = document.querySelectorAll(".bottom,#lyrics,#display2,#display,#overlay");
for (var child of wholepage) {
  child.classList.add("fadeout");
  child.classList.add("fadetrans");
}

var slider0;
var control_return = [];
var seeking = false;
var sync = 0;
var line = document.getElementsByClassName("line");
function playerBegin(lang_main,lang_second,time,sync) {
	var i = 0,y = 36,fade = true;
	var done;
	var k = 0;
	var change = function(lang_main_,lang_second_){
		lang_main = lang_main_;
		lang_second = lang_second_;
		display.innerHTML = "";
		for (var j = 0; j < lang_main.length; j++){
			display.innerHTML += lang_main[j];
		}
		seek();
	}
	for (var j = 0; j < lang_main.length; j++){
		display.innerHTML += lang_main[j];
	}
	function update() {
		if(!seeking && (Math.floor(player.currentTime + sync)%2) == k){
			slider0.slider_update(player.currentTime + sync);
			k = (k==0) ? 1 : 0; 
		}
		if(player.currentTime + sync < time[0] || player.currentTime + sync > time[time.length - 1]){
			for (var child of wholepage) {
				  child.classList.add("fadeout");
				}
		}
		if(player.currentTime + sync > time[i] && player.currentTime + sync < time[i+1]){

			if(lang_main[i] == "<div class ='line line_space'></div>"){
				for (var child of wholepage) {
				  child.classList.add("fadeout");
				}
			}
			if(!(lang_main[i] == "<div class ='line line_space'></div>")){
				for (var child of wholepage) {
				  child.classList.remove("fadeout");
				}
			}
			if(line[i].innerHTML){
				line[i].classList.add('line_style');
			}
			if(i){line[i-1].classList.remove('line_style');};
			y -= line[i].offsetHeight;
			display.style.transform = "translate(-50%," + y + "px)";
			
			display2.innerHTML = lang_second[i];
			console.log((player.currentTime + sync) + 'in');
			console.log(i + '###############');
			i++;
		}
	}

	var updater;
	var interval = true;
	var start,stop,seek;

	start = function (){
		if(interval){
			updater = setInterval(update,10);
			interval = false;
		}
	}
	stop = function (){
		if(!interval){
			clearInterval(updater); 
			interval = true;
		}
	}
	
	seek = function(){
		done = false;
		//player.pause();
		console.log("seeking")
		y = 36;
		for(i=0;i<line.length;i++){
			line[i].classList.remove('line_style');;
		}
		i = 0;
		time.forEach(check);
		//player.play();
	}
	control_return[0] = seek;
	function check(item,index) {
		if(item > player.currentTime + sync && !done){
			i = index - 1;
			//console.log(index + 'kkkkkkkkkkkk');
			if(i<0){
				i=0;
			}
			done = true;
			for(var t = 0; t < i; t++){
				//console.log(t + 'tttttttttttttt');
				y -= line[t].offsetHeight;
			}
		}
	}
	return {start,stop,seek,change};
}
 function mousedown0(id){
	seeking = true;
	//console.log("down");
}
function mouseup0(id){ 
	seeking =false;
	//console.log("up")
	player.currentTime = slider0.slider_get() + sync;
	control_return[0]();
}
//Begin the main programm
var engine,data;
async function mainFunction() {
	let response = await makeRequest('GET', '/request');
	data = interpret(response);
	console.log(data);

	data["lyrics"]["romaji"] = process(data["lyrics"]["romaji"],"lyrics");
	data["lyrics"]["english"] = process(data["lyrics"]["english"],"lyrics");
	data["time"] = process(data["time"],"");

	var source = document.createElement('source');
	source.setAttribute('src',process(data["localfile"],""));
	player.appendChild(source);
	//Seeker seeker
	player.oncanplay = function() {
	   	//seeker.max = player.duration;
	   	slider0 = new Slider("element0",{ 
			'min' : 0,
			'max' : player.duration,
			'rate' : 200,
			 events : {
				'mouseup':mouseup0,
				'mousedown':mousedown0,
			},
		});
	   	waiting.classList.add("fadeout");
		startshow.classList.add("fadein");
	};
	engine = playerBegin(data["lyrics"]["romaji"],data["lyrics"]["english"],data["time"],0);
	player.addEventListener("seeked", async function() {engine.seek(); engine.start();player.play();});
	player.addEventListener("play",function() {engine.seek(); engine.start(); animation1();});
	player.addEventListener("pause",function(){engine.stop();});
	player.addEventListener("ended",function(){ console.log("ended"); engine.stop();});

	playalt[0].addEventListener("click",function(){player.play();});
	window.addEventListener("resize", engine.seek);
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
mainFunction();
