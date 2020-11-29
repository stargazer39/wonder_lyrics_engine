//Animation for Intro
var intro = $('#intro');
var waiting = $('#waiting');
var startshow = $('#startshow');
var playalti = $(".playalt")
//Animation for controls
var settings = $('#settings');
var controls = $('#controls');

//Control Panel lol
controls.mouseout(function(){ controls.removeClass("anisettings")});
controls.mouseover(function(){ controls.addClass("anisettings")});
settings.mouseover(function(){ controls.addClass("anisettings")});

//Seeker
var seeking = false;
var slider0;

var display = $("#lyrics");
var display2 = $("#display2");
var line

var player;
var player_next;

var wholepage = $(".bottom,#lyrics,#display2,#display,#overlay");
wholepage.addClass("fadeout fadetrans");

var data;
async function request_get(){
	let result = await makeRequest('GET', 'http://localhost:8080')
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
		player_next.removeClass("play");
		intro.addClass("introanim");
		await sleep(1000);
		intro.addClass("disnone");
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
		display.html(lang_main.join("\n"))
		seek();
	}

	display.html(lang_main.join("\n"))

	var i = 0,y = 36,fade = true,done,k = 0;
	line = $(".line");
	function update() {
		if(!seeking && (Math.floor(player.getCurrentTime() + sync)%2) == k){
			slider0.slider_update(player.getCurrentTime() + sync);
			k = (k==0) ? 1 : 0; 
		}
		if(player.getCurrentTime() + sync < time[0] || player.getCurrentTime() + sync > time[time.length - 1]){
			wholepage.addClass("fadeout");
		}
		if(player.getCurrentTime() + sync > time[i] && player.getCurrentTime() + sync < time[i+1]){

			if(lang_main[i] == "<div class ='line line_space'></div>"){
				wholepage.addClass("fadeout");
			}
			if(!(lang_main[i] == "<div class ='line line_space'></div>")){
				wholepage.removeClass("fadeout");
			}
			if($(line[i]).html()){
				$(line[i]).addClass('line_style');
			}
			if(i){$(line[i-1]).removeClass('line_style');};
			y -= $(line[i]).outerHeight();
			display.css("transform","translate(-50%," + y + "px)");
			
			display2.html(lang_second[i])
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
		line.removeClass('line_style');
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
				y -= $(line[t]).outerHeight();
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
	playalti.on("click",function(){playalt(false);});
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
			waiting.addClass("fadeout");
			startshow.addClass("fadein");
			//control_return[0]();
			player_next = $("#player")
			player_next.addClass("play");
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