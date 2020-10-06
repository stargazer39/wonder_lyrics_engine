//Animation for Intro
var intro = document.getElementById('intro');
var waiting = document.getElementById('waiting');
var startshow = document.getElementById('startshow');
var playalti = document.getElementsByClassName("playalt")
//Animation for controls
var settings = document.getElementById('settings');
var controls = document.getElementById('controls');

controls.addEventListener('mouseout',function(){ controls.classList.remove("anisettings")});
controls.addEventListener('mouseover',function(){ controls.classList.add("anisettings")});
settings.addEventListener('mouseover',function(){ controls.classList.add("anisettings")});

//Seeker
var seeking = false;
var slider0;

var display = document.getElementById("lyrics");
var display2 = document.getElementById("display2");
var line = document.getElementsByClassName("line");

var player;
var player_next;

var wholepage = document.querySelectorAll(".bottom,#lyrics,#display2,#display,#overlay");
for (var child of wholepage) {
	  child.classList.add("fadeout");
	  child.classList.add("fadetrans");
}

var data;
async function request_get(){
	let result = await makeRequest('GET', '/request')
	data = interpret(result);
	data["lyrics"]["romaji"] = process(data["lyrics"]["romaji"],"lyrics");
	data["lyrics"]["english"] = process(data["lyrics"]["english"],"lyrics");
	data["time"] = process(data["time"],"");
	data["youtube"] = process(data["youtube"],"");
	return data;
}
//Initializ Youtube API
var engine;
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
				
//YT API Events
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

var sync = 0;
function engine(lang_main,lang_second,time,sync){
	console.log("engine ya")
	var change = function(lang_main_,lang_second_){
		lang_main = lang_main_;
		lang_second = lang_second_;
		display.innerHTML = "";
		for (var j = 0; j < lang_main.length; j++){
			display.innerHTML += lang_main[j];
		}
		seek();
	}
	for (var j = 0; j < lang_main.length; j++) {
		display.innerHTML += lang_main[j];
	}
	var i = 0,y = 36,fade = true,done,k = 0;
	function update() {
		if(!seeking && (Math.floor(player.getCurrentTime() + sync)%2) == k){
			slider0.slider_update(player.getCurrentTime() + sync);
			k = (k==0) ? 1 : 0; 
		}
		if(player.getCurrentTime() + sync < time[0] || player.getCurrentTime() + sync > time[time.length - 1]){
			for (var child of wholepage) {
				  child.classList.add("fadeout");
				}
		}
		if(player.getCurrentTime() + sync > time[i] && player.getCurrentTime() + sync < time[i+1]){

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
			console.log((player.getCurrentTime() + sync) + 'in');
			console.log(i + '###############');
			i++;
		}
	}

	var updater;
	var interval = true;

	var start,stop,seek,playalt;
	start = function(){
		if(interval){
			console.log("started");
			updater = setInterval(update,100);
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
			line[i].classList.remove('line_style');
		}
		i = 0;
		time.forEach(check);
		//player.play();
	}
	function check(item,index) {
		if(item > player.getCurrentTime() + sync && !done){
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
	window.addEventListener("resize", seek);
	playalt = function(pause_available){ 
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
	document.addEventListener('keydown', function (event) {if (event.key === ' ') { playalt(true);}});
	playalti[0].addEventListener("click",function(){playalt(false);});
	return {start,stop,seek,change};
}

async function main(){
	let data = await request_get();
	//Load the video and make slider ready as well
	var tag = document.createElement('script');
	tag.id = 'iframe-demo';
	tag.src = 'https://www.youtube.com/iframe_api';
	var firstScriptTag = document.getElementsByTagName('script')[0];
	firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

		//New YT Player
		window.onYouTubeIframeAPIReady = function() {
			player = new YT.Player('player', {
					videoId : data["youtube"],
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
		window.onPlayerReady = function(event){
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
			console.log('onPlayerReady')
			//player.loadVideoById(data["youtube"],0);
			engine = engine(data["lyrics"]["romaji"],data["lyrics"]["english"],data["time"],0);
			console.log(engine);
		}
		window.onPlayerStateChange = function(event){
				console.log('changed' + player.getPlayerState())
				switch(player.getPlayerState()){
					case 1:
						engine.seek();
						engine.start();
						animation1();
			        	break;
			        //If player state changed by any(other) means
			        case 2:
			        case 5:
			        case 0:
			        	engine.stop();
			        	break;
				}
			}
}
main();