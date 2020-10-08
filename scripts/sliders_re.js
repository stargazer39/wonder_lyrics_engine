
class Slider {
	constructor(id,args){
		this.args = args;
		this.id = id;
		var min = args.min;
		var max = args.max;
		var rate = args.rate;
		var slider_color = args.slider;
		var thumb_color = args.thumb;
		var background_color = args.background;
		//console.log(typeof(min),typeof(max),typeof(rate),typeof(id),typeof(slider),typeof(background));
		if(!args.events){
			args.events = {};
			args.events.mouseup = function(){};
			args.events.mousedown = function(){};
			args.events.mousemove = function(){};
		}else{
			args.events.mouseup = args.events.mouseup ? args.events.mouseup : function(){};
			args.events.mousedown = args.events.mousedown ? args.events.mousedown : function(){};
			args.events.mousemove = args.events.mousemove ? args.events.mousemove : function(){};
		}

		rate = rate ? rate : 10;
		max = max ? max : 100;
		min = min ? min  : 0;
		slider_color = slider_color ? slider_color : "#00b5d8";
		background_color = background_color ? background_color : "#ff00cd";
		thumb_color = thumb_color ? thumb_color : "#000000";

		if(!id) { throw "wtf? id is bullshiz" }

		var container = document.querySelector("#" + id)
		var progress = document.querySelector("#" + id + " .play-progress");
		var ticker = document.querySelector("#" + id + " .ticker");

		//colors
		container.style.backgroundColor = background_color;
		progress.style.backgroundColor = slider_color;
		ticker.style.backgroundColor = thumb_color;

		if(!container || !progress || !ticker ){ throw "the slider element missing. id :" + id }
		//making th anime class
		
		var mousedown = false,global_val = 0;
		var min = 0,max,allowed = true;

		function onMouseDown(e){
			args.events.mousedown();
			e.preventDefault();
			var pixel = (e.clientX - container.getBoundingClientRect().left )
			progress.style.transform = "scaleX(" + (pixel/container.clientWidth) + ")";
			ticker.style.transform = "translateX(" + (pixel - ticker.clientWidth/2) + "px)";
			global_val = pixel/container.clientWidth;
			mousedown = true;
			progress.classList.remove('slider_trans');
			ticker.classList.remove('slider_trans');
		}
		function onMouseUp(){
			args.events.mouseup();
			mousedown = false;
			progress.classList.add('slider_trans');
			ticker.classList.add('slider_trans');
		}
		function onMove(e){
			if(mousedown){
				args.events.mousemove();
				e.preventDefault()
				var pixel = (e.clientX - container.getBoundingClientRect().left );
				if(0 <= pixel &&  pixel <= container.clientWidth){
					progress.style.transform = "scaleX(" + (pixel/container.clientWidth) + ")";
					ticker.style.transform = "translateX(" + (pixel - ticker.clientWidth/2) + "px)";
					global_val = pixel/container.clientWidth;
				}
			}
		}
		document.addEventListener("mouseup",onMouseUp);
		container.addEventListener("mousedown",onMouseDown);
		document.addEventListener("mousemove",onMove);

		var slider_get_meth = function(){
			if(global_val < min){
					return min;
				}else if(global_val > max){
					return max;
				}else{
					return global_val*max;
				}
		}

		var slider_update_meth = function(now){
			if(now <= max && !mousedown){
				progress.style.transform = "scaleX(" + now/max + ")";
				ticker.style.transform = "translateX(" + (now/max*container.clientWidth - ticker.clientWidth/2) + "px)";
				global_val = (now/max*container.clientWidth)/container.clientWidth;
			}
		}
		function sleep(ms) {
		  return new Promise(resolve => setTimeout(resolve, ms));
		}

		window.addEventListener("resize", async function(){
			mousedown = true;
			slider_update_meth(slider_global);
			await sleep(rate);
			mousedown = false;
		});

		this.slider_update = function(val){
			if(allowed){
				slider_update_meth(val);
			}
		}

		this.slider_get = function(){
			return slider_get_meth();
		}
	}
}

//document.documentElement.style.setProperty('--slider_thumb-w' , '20px')
//document.documentElement.style.setProperty('--slider_height' , '20px')