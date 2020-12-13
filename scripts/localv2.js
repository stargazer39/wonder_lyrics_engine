//Begin the main programm
var youtube = true
var host = "localhost"
// 2. This code loads the IFrame Player API code asynchronously.
console.log('tag')
if(youtube){
	var tag = document.createElement('script');

	tag.src = "https://www.youtube.com/iframe_api";
	var firstScriptTag = document.getElementsByTagName('script')[0];
	firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

var engine,data;
let song_id = parseQuery('song_id',window.location.href)
console.log(song_id)

async function getDataReady(){
	try{
		let data = await makeRequest('GET',`http://${host}?get=lyrics&song_id=${song_id}`)
		let json = JSON.parse(data)
		console.log(json)
		return json
	}catch(e){
		console.log('An Error occured while reaching the server')
		console.log(e)
		return false
	}
}

async function YTAPIReady(){
	return new Promise((resolve,reject) =>{
		var timeout = false
		var t = setTimeout(()=>{ timeout = true; reject(false)}, 30000);
		window.onYouTubeIframeAPIReady = () =>{
			if(!timeout){
				clearTimeout(t)
				resolve(YT)
			}
		}
	})
}

var song_data,playerNew,player,started = false;
async function BeginMain(){
	var song_data = await getDataReady();
	if(!youtube){
		console.log("Youtube Version :" + youtube)
		$('#player2').hide()
		player = document.getElementById('player');
		var source = document.createElement('source');
		source.setAttribute('src',song_data.links.local);
		player.appendChild(source);
		player.load()
		player.oncanplay = () =>{
			if(!started){
				hajimeruso(song_data)
				started = true
			}
		}
	}else{
		console.log("Youtube Version :" + youtube)
		var YT = await YTAPIReady()
		var playerNew = new YT.Player('player2', {
			height: '390',
	    	width: '640',
	    	videoId: song_data.links.youtube,
		    events: {
		    	'onReady': onPlayerReady,
		    	'onStateChange': onPlayerStateChange
		    }
	    });
	    function onPlayerReady(){
	    	console.log('onPlayerReady')
	    	player = {
				oncanplay:"",
				event_blocker:[],
				triggers:[],
				addEventListener(t,call){
					this.triggers.push({
					'trigger':t,
					'callback':call
					})
				},
				get duration(){
					return playerNew.getDuration()
				},
				get currentTime(){
					return playerNew.getCurrentTime()
				},
				get paused(){
					switch(playerNew.getPlayerState()){
						case 0:
						case 5:
						case 2:
							return true;
							break;
						case 1:
							return false;
					}
				},
				set currentTime(val){
					playerNew.seekTo(val,true)
				},
				set oncanplay_(callback){
					this.oncanplay = callback
				},
				event(t){
					if(!this.event_blocker.includes(t)){
						for(let tri of this.triggers){
							if(tri.trigger == t) {tri.callback()};
						}
					}
			          /*console.log(this.event_blocker.includes(t))
			          this.triggers[0].callback()*/
				},
				play(){
					playerNew.playVideo()
				},
				pause(){
					playerNew.pauseVideo()
				}
			}
			hajimeruso(song_data)
	    }
		
		function onPlayerStateChange(){
			console.log('changed' + playerNew.getPlayerState())
			switch(playerNew.getPlayerState()){
				case 1:
					player.event("play")
					player.event("seeked")
		        	break;
		        //If player state changed by any(other) means
		        case 2:
		        	player.event("pause")
		        	break;
		        case 5:
		        case 0:
		        	player.event("ended")
		        	break;

			}
		}
	}
}
BeginMain()
/*
function onYouTubeIframeAPIReady1() {
	console.log('onAPI')
	if(youtube){
		song_data = getDataReady()
		playerNew = new YT.Player('player2', {
			height: '390',
	    	width: '640',
	    	videoId: song_data.links.youtube,
		    events: {
		    	'onReady': onPlayerReady,
		    	'onStateChange': onPlayerStateChange
		    }
	    });
	}
}


if(youtube){
	player = {
		oncanplay:"",
		event_blocker:[],
		triggers:[],
		addEventListener(t,call){
			this.triggers.push({
			'trigger':t,
			'callback':call
			})
		},
		get duration(){
			return playerNew.getDuration()
		},
		get currentTime(){
			return playerNew.getCurrentTime()
		},
		get paused(){
			switch(playerNew.getPlayerState()){
				case 0:
				case 5:
				case 2:
					return true;
					break;
				case 1:
					return false;
			}
		},
		set currentTime(val){
			playerNew.seekTo(val,true)
		},
		set oncanplay_(callback){
			this.oncanplay = callback
		},
		event(t){
			if(!this.event_blocker.includes(t)){
				for(let tri of this.triggers){
					if(tri.trigger == t) {tri.callback()};
				}
			}
		},
		play(){
			playerNew.playVideo()
		},
		pause(){
			playerNew.pauseVideo()
		}
	}
}else{
	makeRequest('GET',`http://${host}?get=lyrics&song_id=${song_id}`).then(async (data)=>{
		console.log('data')
		song_data = JSON.parse(data)
		console.log(song_data)
		player = document.getElementById('player');
		var source = document.createElement('source');
		source.setAttribute('src',song_data.links.local);
		player.appendChild(source);
		player.load()
		player.oncanplay = () =>{
			if(!started){
				hajimeruso(song_data)
				started = true
			}
		}
	})
}
*/
/*
function onPlayerReady(event){
	if(youtube){
		hajimeruso(song_data)
	}
}

function onPlayerStateChange(e){
	console.log('changed' + playerNew.getPlayerState())
	switch(playerNew.getPlayerState()){
		case 1:
			player.event("play")
			player.event("seeked")
        	break;
        //If player state changed by any(other) means
        case 2:
        	player.event("pause")
        	break;
        case 5:
        case 0:
        	player.event("ended")
        	break;

	}
}
*/
function hajimeruso(song_data){
	console.log('ppt');
	if(song_data){
		$('#music-info').html(`${ObjIncludes(song_data.song_info,'names')[0] || "Unknown"} Ft.${ObjIncludes(song_data.song_info,'singers')[0] || "Unknown Singer"} | Song by : ${ObjIncludes(song_data.song_info,'artists')[0] || "Unknown Artist"}`)
		console.log('pp');
	   	slider0 = new Slider("element0",{ 
					'min' : 0,
					'max' : player.duration,
					'rate' : 200,
					 events : {
						'mouseup':mouseup0,
						'mousedown':mousedown0
					},
				});
	   	waiting.addClass("fadeout");
		startshow.addClass("fadein");
		
		engine = playerBegin(processToHTML(song_data.lyrics.lyrics['romaji']),processToHTML(song_data.lyrics.lyrics['english']),song_data.timecode,0);
		player.addEventListener("seeked",() => {
			engine.seek()
			engine.start()
			if(player.paused){
				player.play()
			}
		})
		player.addEventListener("play",() => {
			engine.seek()
			engine.start()
			animation1()
		});
		player.addEventListener("pause",() => {
			engine.stop()
		})
		player.addEventListener("ended",() => {
			console.log("ended")
			engine.stop()
		})

		playalt.on("click",function(){player.play();});
		$(window).on("resize", engine.seek);
		$(document).on('keydown', function (event) {
		  if (event.key === ' ') {
		  	if(player.paused){
		  		player.play();
		  	}else{
		  		player.pause();
		  	}
		  }
		});
	}else{
		throw "The server couldn't be contracted or the song id could not be found"
	}

}









//Animation for Intro
var intro = $('#intro');
var waiting = $('#waiting');
var startshow = $('#startshow');
var playalt = $(".playalt");

//Animation for controls
$('#toggle-1,#controls').on('mouseover',()=>{
	$('#controls').css('width','140px')
})
$('#toggle-1,#controls').on('mouseleave',()=>{
	$('#controls').css('width','0')
})
//var settings = $('#settings');
//var controls = $('#controls');
var title = $('#music-title')
var elapsed = $('#elapsed')
//Control Panel lol
//controls.mouseout(function(){ controls.removeClass("anisettings")});
//controls.mouseover(function(){ controls.addClass("anisettings")});
//settings.mouseover(function(){ controls.addClass("anisettings")});

//Ainmation
var begin = false;
async function animation1(){
	if(!begin){
		intro.addClass("introanim");
		await sleep(1000);
		intro.addClass("disnone");
		begin = true;
		}
}

//The Engine Starts Here
var display = $("#lyrics");
var display2 = $("#display2");
//var player = document.getElementById("player");
//second feature
var floating = $("#floating_lyr");

var wholepage = $(".bottom,#lyrics,#display2,#display,#overlay,#lyrics-ticker");
wholepage.addClass("fadeout fadetrans");
/*for (var child of wholepage) {
  child.classList.add("fadeout");
  child.classList.add("fadetrans");
}*/

var slider0;
var control_return = [];
var seeking = false;
var sync = 0;
var line;
function playerBegin(lang_main,lang_second,time,sync) {
	var i = 0,y = 0,fade = true;
	var done;
	var k = 0;
	var floating_down = false;
	var floating_offset = [0,0];

	floating.on('mousedown',function(e){
		console.log(e);
		floating_down = true;
		floating_offset = [e.clientX - floating.position().left,e.clientY - floating.position().top]
		console.log(floating_offset);
	})
	window.addEventListener('mouseup',function(){
		if (floating_down) {
			floating_down = false;
		}
	})
	window.addEventListener('mousemove',function(e){
		if(floating_down){
			floating.css("left",  e.clientX - floating_offset[0] + 'px');
			floating.css("top",e.clientY - floating_offset[1] + 'px');
		}
	})
	var change = function(lang_main_,lang_second_){
		lang_main = lang_main_;
		lang_second = lang_second_;
		display.html(lang_main.join("\n"));
		seek();
	}
	display.html(lang_main.join("\n"));
	line = $(".line");
	ticker = $("#lyrics-ticker")
	function update() {
		elapsed.html(player.currentTime.toFixed(4))
		if(!seeking && (Math.floor(player.currentTime + sync)%2) == k){
			slider0.slider_update(player.currentTime + sync);
			k = (k==0) ? 1 : 0; 
		}
		if(player.currentTime + sync < time[0] || player.currentTime + sync > time[time.length - 1]){
			wholepage.addClass("fadeout");
		}
		if(time[i] < player.currentTime + sync && player.currentTime + sync < time[i+1]){
			let line_now = $(line[i]);
			let line_before = $(line[i-1])

			line.removeClass('line_style')
			if(!line_now.html()){
				wholepage.addClass("fadeout");
			}else{
				wholepage.removeClass("fadeout");
				ticker.css('height',`${line_now[0].getBoundingClientRect().height}px`)
			}

			switch(i){
				case 0:
					y -= line_now[0].getBoundingClientRect().height/2.0
					break;
				default:
					y -= ((line_now[0].getBoundingClientRect().height/2.0) + line_before[0].getBoundingClientRect().height/2.0);
			}
			console.log()
			display.css("transform","translate(-50%," + y + "px)");
			
			//second feature
			floating.html(lang_main[i]);

			display2.html(lang_second[i]);
			console.log(`At ${player.currentTime + sync}, ${i} Played. Expected: ${time[i+1] || "End"}. Total Length: ${y}\n`);
			//console.log(`${(line_now[0].getBoundingClientRect().height/2.0)} ${line_before[0].getBoundingClientRect().height/2.0}`)
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
		y = 0;
		i = 0;
		var j = 0;		
		time.forEach(check);
		/*while(true){
			if(j == lang_main.length + 1){
				break;
			};
			
			if(time[j] > player.currentTime + sync){
				console.log(`seeked ${j}`)
				i = (j < 0) ? 0 : j - 1;
				break;
			}
			j++
		}
		for(j = 0; j < i; j++){
			switch(j){
				case 0:
					y -= $(line[j])[0].getBoundingClientRect().height/2.0
					break;
				default:
					y -= (($(line[j])[0].getBoundingClientRect().height/2.0) + $(line[j-1])[0].getBoundingClientRect().height/2.0);
			}
		}*/
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
					switch(t){
						case 0:
							y -= $(line[t])[0].getBoundingClientRect().height/2.0
							break;
						default:
							y -= (($(line[t])[0].getBoundingClientRect().height/2.0) + $(line[t-1])[0].getBoundingClientRect().height/2.0);
					}
				}
			}
		}
		//player.play();
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
	engine.seek();
}

