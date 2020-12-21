//Begin the main programm
var youtube = false
var host = "https://wle-server.herokuapp.com/"
var instance = $.fn.deviceDetector;
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
		let data = await makeRequest('GET',`${host}?get=lyrics&song_id=${song_id}`)
		let json = JSON.parse(data)
		console.log(json)
		return json
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

var song_data,playerNew,player,stat,started = false;
async function BeginMain(){
	stat = $('#waiting')
	console.log(stat)
	stat.html(`Waiting for W-L-E server`)
	try{
		song_data = await getDataReady();
	}catch (e){
		console.log(e)
		stat.html(`W-L-E server could not be contracted. Tell Dehemi to fix his stuff.`)
		throw `Node server Could not be contracted. Reqest Timeout.`
	}
	if(!song_data){
		stat.html(`Something went wrong. Wrong song id?`)
		throw `Something went wrong. Wrong song id?`
	}
	if(!youtube){
		stat.html(`Waiting for HTML5 player`)
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
		stat.html(`Waiting for YoutubeAPI`)
		console.log("Youtube Version :" + youtube)
		var YT
		try{
			YT = await YTAPIReady()
		}catch(e){
			console.log(e)
			stat.html(`YoutubeAPI Could not be contracted. Reqest Timeout.`)
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
					return this.YTplayer.getDuration()
				},
				get currentTime(){
					return this.YTplayer.getCurrentTime()
				},
				get paused(){
					switch(this.YTplayer.getPlayerState()){
						case -1:
						case 3:
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
			function YTscale(){
				let v_ratio = song_data.links.yt_dimen[0]/song_data.links.yt_dimen[1]
				let d_ratio = $(window).width()/$(window).height()
				console.log(v_ratio + " " + d_ratio)
				let scale = (v_ratio >= d_ratio) ? v_ratio/d_ratio : d_ratio/v_ratio
				$('#player2').css('transform','scale('+ scale +')')
			}
			$(window).on('resize',()=>{
				YTscale()
			})
			YTscale()
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
$(document).ready(()=>{
	BeginMain()
})

//Animation for Intro
var intro = $('#intro');
var waiting = $('#waiting');
var startshow = $('#startshow');
var playalt = $(".playalt");
var main_play = $("#main-play")
var slider0

function hajimeruso(song_data){
	console.log('Started');
	$('#music-info').html(`${ObjIncludes(song_data.song_info,'names')[0] || "Unknown"} Ft.${ObjIncludes(song_data.song_info,'singers')[0] || "Unknown Singer"} | Song by : ${ObjIncludes(song_data.song_info,'artists')[0] || "Unknown Artist"}`)
	console.log('pp');
   	slider0 = new Slider({
					thumb_height:'20px',
					thumb_width:'20px',
					slider_height:'20px',
					slider_width:'80vw',
					max:player.duration,
					colors:{
						front_color:"#00b5d8",
						back_color:"#ff00cd",
						thumb_color:"#000000"
					}
				})
   	$('#element0').append(slider0.object)
   	slider0.addEventListener('oninput',()=>{
		player.currentTime = slider0.value + sync 
		engine.seek()
	})
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
		mainPlay(true)
		animation1()
	});
	player.addEventListener("pause",() => {
		engine.stop()
		mainPlay(false)
	})
	player.addEventListener("ended",() => {
		console.log("ended")
		engine.stop()
		mainPlay(false)
	})

	playalt.on("click",function(){player.play();});
	main_play.click(()=>{
		if(player.paused){
			mainPlay(true)
			player.play()
		}else{
			mainPlay(false)
			player.pause()
		}
	})
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

async function mainPlay(yes){
	if(!yes){
		main_play.css('opacity',1)
	}else{
		main_play.css('opacity',0)
	}
}


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

	if(!ObjIncludes(args,'primary')) throw `primary langguage not defined`;
	if(!ObjIncludes(args,'secondery')) args.secondery = [];

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
			slider0.value = player.currentTime + sync
			k = (k==0) ? 1 : 0; 
		}
		if(player.currentTime + sync < args.timecode[0] || player.currentTime + sync > args.timecode[args.timecode.length - 1]){
			wholepage.addClass("fadeout");
		}
		if(args.timecode[i] < player.currentTime + sync && player.currentTime + sync < args.timecode[i+1]){
			updateDisplay(i,args.primary[i],args.secondery[i])
			console.log(`At ${player.currentTime + sync}, ${i} Played. Expected: ${args.timecode[i+1] || "End"}. Total Length: ${y}\n`);
			i++;
		}
	}

	function updateDisplay(index,primary,secondery){
		let line_now = $(line[index]);
		let line_before = $(line[index-1])

		if(!line_now.html()){
			wholepage.addClass("fadeout");
		}else{
			wholepage.removeClass("fadeout");
			ticker.css('height',`${line_now.mySHeight()}px`)
		}

		switch(i){
			case 0:
				y -= line_now.mySHeight()/2.0
				break;
			default:
				let before = (line_before[0]) ? line_before.mySHeight()/2.0 : 0
				y -= ((line_now.mySHeight()/2.0) + before);
		}
		display.css("transform","translate(-50%," + y + "px)");
		
		//second feature
		if(secondery) display2.html(secondery);
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
		let line_now = $(line[i]);
		ticker.css('height',`${line_now.mySHeight()}px`)
		display.css("transform","translate(-50%," + y + "px)");
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
/* function mousedown0(id){
	seeking = true;
	//console.log("down");
}
function mouseup0(id){ 
	seeking =false;
	//console.log("up")
	player.currentTime = slider0.slider_get() + sync;
	engine.seek();
}*/


