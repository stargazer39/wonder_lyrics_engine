var tag = document.createElement('script');
tag.id = 'iframe-demo';
tag.src = 'https://www.youtube.com/iframe_api';

var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var playerNew
function onYouTubeIframeAPIReady() {
	playerNew = new YT.Player('player2', {
			videoId : "3iMdlFaiO4s",
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

var player = {
	oncanplay:"",
	event_blocker:[],
	triggers:[],
	addEventListener(t,call){
		this.triggers.push({
			'trigger':t,
			'callback':call
		})
	},
	get currentTime(){
		return playerNew.getCurrentTime()
	},
	set currentTime(val){
		playerNew.seekTo(val,true)
	},
	set oncanplay_(callback){
		this.oncanplay = callback
	},
	event(t){
		if(!this.event_blocker.includes(t)){
			for(let trigger of this.triggers){
				if(trigger == t) trigger.callback();
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

function onPlayerReady(event){
	player.oncanplay()
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


/*class YTPlayerWrapper{
	constructor(ytargs,tg){
		this.tg = tg
		this.ytargs = ytargs
		//this.oncanplayf = oncanplayf

		//this.triggers = triggers
		this.triggers = []
		var tag = document.createElement('script');
		tag.id = 'iframe-demo';
		tag.src = 'https://www.youtube.com/iframe_api';

		var firstScriptTag = document.getElementsByTagName('script')[0];
		firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

		//this.player = player
		//this.e_blocker = e_blocker
		this.e_blocker = []
		var w_player
		this.player = null
		window.onYouTubeIframeAPIReady = function() {
			w_player = new YT.Player(tg, {
					videoId : ytargs.videoId,
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
			this.player = w_player
		}
		function fireTrigger(t){
			if(!this.e_blocker.includes(t)){
				for(let trigger of this.triggers){
					if(trigger == t) trigger.callback();
				}
			}
		}

		window.onPlayerReady = function(event){
				this.oncanplayf()
		}
		window.onPlayerStateChange = function(event){
				console.log('changed' + this.player.getPlayerState())
				switch(this.player.getPlayerState()){
					case 1:
						fireTrigger("play")
						fireTrigger("seeked")
			        	break;
			        //If player state changed by any(other) means
			        case 2:
			        	fireTrigger("pause")
			        	break;
			        case 5:
			        case 0:
			        	fireTrigger("ended")
			        	break;

				}
		}

	}
	set oncanplay(func){
		this.oncanplayf = func
	}
	get currentTime(){
		return this.player.getCurrentTime()
	}
	set currentTime(val){
		return this.player.seekTo(val,true)
	}
	play(){
		this.player.playVideo()
	}
	pause(){
		this.player.pauseVideo()
	}
	addEventListener(trigger,callback){
		this.triggers.push({
			'trigger':trigger,
			'callback':callback
		})
	}
}
*/