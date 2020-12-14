//Begin the main programm
var youtube = false
var host = "localhost"
var instance = $.fn.deviceDetector;
console.log(instance.getInfo())
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

var YoutubeAPI
function onYouTubeIframeAPIReady(){
	YoutubeAPIReady = YT
}
async function YTAPIReady(){
	console.log('YTAPIReady')
	return new Promise((resolve,reject) =>{
		var check = setInterval(()=>{
			if(YoutubeAPIReady) resolve(YoutubeAPIReady);
		},100)
		var t = setTimeout(()=>{
			clearInterval(check) 
			if(!YoutubeAPIReady) {
				reject(false)
			}else{
				resolve(YoutubeAPIReady)
			}
		}, 30000);
	})
}

var song_data,playerNew,player,started = false;
async function BeginMain(){
	try{
		var song_data = await getDataReady();
	}catch (e){
		console.log(e)
		throw `Node server Could not be contracted. Reqest Timeout.`
	}
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
		var YT
		try{
			YT = await YTAPIReady()
		}catch(e){
			console.log(e)
			throw `YTAPI Could not be contracted. Reqest Timeout.`
		}
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
	    		YTplayer:playerNew,
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
					this.YTplayer.seekTo(val,true)
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
					this.YTplayer.playVideo()
				},
				pause(){
					this.YTplayer.pauseVideo()
				}
			}
			hajimeruso(song_data)
	    }
		
		function onPlayerStateChange(){
			console.log(`YT state = ${playerNew.getPlayerState()}` )
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

function hajimeruso(song_data){
	console.log('Started');
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
	
	engine = playerBegin({
		'primary': processToHTML(song_data.lyrics.lyrics['romaji']),
		'secondery':processToHTML(song_data.lyrics.lyrics['english']),
		'timecode':song_data.timecode
	});
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
}









//Animation for Intro
var intro = $('#intro');
var waiting = $('#waiting');
var startshow = $('#startshow');
var playalt = $(".playalt");

//Animation for controls
$('#main-icon,#sub-panel-1').on('mouseover touchend',()=>{
	var width = 0;
	$.each($('#sub-panel-1').children(),(index,value) =>{
		width += $(value).mySWidth()
	})
	$('#sub-panel-1').css('width',width)
})

if(instance.getInfo().mobile){
	var touchTimer
	$('#main-icon,#sub-panel-1').on('touchend',()=>{
		if(touchTimer) clearInterval(touchTimer)
		touchTimer = setTimeout(()=>{
			$('#sub-panel-1').css('width','0')
		},5000)
	})
}

$('#main-icon,#sub-panel-1').on('mouseleave',()=>{
	$('#sub-panel-1').css('width','0')
})

var title = $('#music-title')
var elapsed = $('#elapsed')

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

//second feature
var floating = $("#floating_lyr");

var wholepage = $(".bottom,#lyrics,#display2,#display,#overlay,#lyrics-ticker");
wholepage.addClass("fadeout fadetrans");

var slider0;
var control_return = [];
var seeking = false;
var sync = 0;
var line;
function playerBegin(args) {
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
		args.primary = lang_main_;
		args.secondery = lang_second_;
		display.html(args.primary.join("\n"));
		seek();
	}
	display.html(args.primary.join("\n"));
	line = $(".line");
	ticker = $("#lyrics-ticker")
	function update() {
		elapsed.html(player.currentTime.toFixed(4))
		if(!seeking && (Math.floor(player.currentTime + sync)%2) == k){
			slider0.slider_update(player.currentTime + sync);
			k = (k==0) ? 1 : 0; 
		}
		if(player.currentTime + sync < args.timecode[0] || player.currentTime + sync > args.timecode[args.timecode.length - 1]){
			wholepage.addClass("fadeout");
		}
		if(args.timecode[i] < player.currentTime + sync && player.currentTime + sync < args.timecode[i+1]){
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
			floating.html(args.primary[i]);

			display2.html(args.secondery[i]);
			console.log(`At ${player.currentTime + sync}, ${i} Played. Expected: ${args.timecode[i+1] || "End"}. Total Length: ${y}\n`);
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
		args.timecode.forEach(check);
		/*while(true){
			if(j == args.primary.length + 1){
				break;
			};
			
			if(args.timecode[j] > player.currentTime + sync){
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

