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

//Seeker
var seeking = false;
//var seeker = document.getElementById("seeker")
var slider0;

var display = document.getElementById("lyrics");
var display2 = document.getElementById("display2");

//Initializ Youtube API
var tag = document.createElement('script');
	tag.id = 'iframe-demo';
	tag.src = 'https://www.youtube.com/iframe_api';
	var firstScriptTag = document.getElementsByTagName('script')[0];
	firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var wholepage = document.querySelectorAll(".bottom,#lyrics,#display2,#display,#overlay,#overlay2");

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

function processLyrics(data){
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

function process(array,seperator){
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

var rsplit,lsplit,tsplit,srcURL;
async function waitforme(){
	let data2 = await makeRequest('GET', '/request')
	var data = processLyrics(data2);
	rsplit = process(data["lyrics"]["romaji"],"<br>");
	lsplit = process(data["lyrics"]["english"],"<br>");
	tsplit = process(data["time"],"");
	srcURL = process(data["youtube"],"");
}
//New YT Player
var player;
async function onYouTubeIframeAPIReady() {
	//API will wait until the server
	await waitforme();
	for (var j = 0; j < rsplit.length; j++) {
		display.innerHTML += rsplit[j];
	}
	console.log(rsplit);
	console.log("done");
	player = new YT.Player('player', {
			videoId : srcURL,
			playerVars: {
	      'controls': 0,
	      'enablejsapi' : 1,
	      'start' : 0,
	    },
	  events: {
	  	'onReady': onPlayerReady,
	    'onStateChange': onPlayerStateChange
	  }
	});
}
var player_next;
//YT API Events
var start_,stop_,seek_;
var control_return;
function onPlayerReady(event){
	//Little Hack from mr
	//video.video-stream.html5-main-video
	//video-stream html5-main-video
	//var hack = document.querySelector("video.video-stream.html5-main-video");
	//Get the created player
	control_return = playerBegin();

	waiting.classList.add("fadeout");
	startshow.classList.add("fadein");
	//control_return[0]();
	player_next = document.getElementById("player")
	player_next.classList.add("play");
	//Seerker stuff
	slider0 = new Slider("element0",{ 
			'min' : 0,
			'max' : player.getDuration(),
			'rate' : 200,
			 events : {
				'mouseup':mouseup0,
				'mousedown':mousedown0
			},
		});
}
 function mousedown0(){
	seeking = true;
	console.log("down");
}
function mouseup0(){ 
	seeking =false;
	console.log("up")
	player.seekTo(slider0.slider_get() + sync,true);
	player.playVideo();
}

for (var child of wholepage) {
	  child.classList.add("fadeout");
	  child.classList.add("fadetrans");
	}

var sync = 0;
function playerBegin(){
	player_next = document.getElementById("player");
	player_next.requestFullscreen;
	//var hack = player_next.contentWindow.document.querySelector("video.video-stream.html5-main-video");
	//hack.classList.add("hack");
	var i = 0,y = -36,fade = true;
	var done;
	var k = 0;
	function update() {
		//console.log(player.getCurrentTime());
		//Seeker's Stuff
		if(!seeking && (Math.floor(player.getCurrentTime() + sync)%2) == k){
			slider0.slider_update(player.getCurrentTime() + sync);
			if(k==0){
				k=1;
			}else{
				k=0;
			}
		}
		if(player.getCurrentTime() + sync < tsplit[0] || player.getCurrentTime() + sync> tsplit[tsplit.length - 1]){
			for (var child of wholepage) {
				  child.classList.add("fadeout");
				}
		}
		if(player.getCurrentTime() + sync > tsplit[i] && player.getCurrentTime() + sync < tsplit[i+1]){
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
			display2.innerHTML = lsplit[i]
			//console.log(player.getCurrentTime() + 'in');
			//console.log(i + '###############');
			i++;
		}
	}

	var updater;
	var interval = true;

	start_ = function(){
		if(interval){
			console.log("started");
			updater = setInterval(update,100);
			interval = false;
		}
	}
	stop_ = function (){
		if(!interval){
			clearInterval(updater); 
			interval = true;
		}
	}
	seek_ = function(){
		done = false;
		//player.pause();
		tsplit.forEach(check);
		//player.play();
	}
	function check(item,index) {
		if(item > player.getCurrentTime() + sync && !done){
			console.log(index);
			i = index - 1;
			if(i<0){
				i=0;
			}
			done = true;
		}
	}
	
	var playalt_ = function(pause_available){ 
		switch(player.getPlayerState()){
	  		case -1:
	  			player.seekTo(0 + sync,true);
	  			player.playVideo();
	  			break;
			case 1:
				if(pause_available){
					player.pauseVideo();
				}
	        	break;
	        case 2:
	        case 5:
	        case 0:
	        	player.playVideo();
	        	break;
	    }
	  }
	document.addEventListener('keydown', function (event) {if (event.key === ' ') { playalt_(true);}});
	playalt[0].addEventListener("click",function(){playalt_(false);});

	//Returning the control to outside
	var control_return = new Array();
	control_return[0] = start_;
	control_return[1] = stop_;
	control_return[2] = seek_;
	control_return[3] = playalt_;
	return control_return;
}

//Animation
var begin = false;
async function animation1(){
	if(!begin){
		player_next.classList.remove("play");
		intro.classList.add("introanim");
		await sleep(1000);
		intro.classList.add("disnone");
		begin = true;
		}
}
				
function onPlayerStateChange(event){
	console.log('changed' + player.getPlayerState())
	switch(player.getPlayerState()){
		case 1:
			control_return[2]();
			control_return[0]();
			animation1();
        	break;
        //If player state changed by any(other) means
        case 2:
        case 5:
        case 0:
        	control_return[1]();
        	break;
	}
}