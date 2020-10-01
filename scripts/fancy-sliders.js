
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

		var slider_global,slider_pixelval = 0;
		var offset = [],isDown = false,mousePosition = [],slider_limits = [],allowed = true;
		slider_limits = [ max, min ];

		var slider_parent = document.querySelector("#" + id)
		var slider_fill_left = document.querySelector("#" + id + " .slider_fill_left");
		var slider_fill_right = document.querySelector("#" + id + " .slider_fill_right");
		var slider_thumb = document.querySelector("#" + id + " .thumb");

		//colors
		slider_fill_left.style.backgroundColor = background_color;
		slider_fill_right.style.backgroundColor = slider_color;
		slider_thumb.style.backgroundColor = thumb_color;

		if(!slider_parent || !slider_fill_left || !slider_fill_right || !slider_thumb ){ throw "the slider element missing. id :" + id }
		//making th anime class
		var style = document.createElement('style');
		style.type = 'text/css';
		style.innerHTML = '.slider_mousemove_' + id + ' { transition: transform ' + rate +'ms; transition-timing-function: ease-out; }';
		document.getElementsByTagName('head')[0].appendChild(style);
		slider_thumb.classList.add("slider_mousemove_"+id);

		slider_thumb.addEventListener('mousedown', function(e) {
			args.events.mousedown();
			//console.log("down"); 
			allowed = false;
			isDown = true;
			slider_thumb.classList.remove("slider_mousemove_"+id);
			offset = [e.clientX - slider_pixelval,0];
			console.log(e.clientX);
		}, true);

		function sleep(ms) {
		  return new Promise(resolve => setTimeout(resolve, ms));
		}
		document.addEventListener('mousemove', function(e) {
			e.preventDefault();
			if (isDown) {
				 mousePosition = [e.clientX,0]; 
				 slider_thumb.style.transform = "translate(" + (mousePosition[0] - offset[0]) + 'px)'; 
				 slider_pixelval = (mousePosition[0] - offset[0]);
				 args.events.mousemove();
				}
		}, true);

		document.addEventListener('mouseup', function() { 
			if(isDown){
				allowed = true;
				isDown = false; 
				if(!slider_thumb.classList.contains("slider_mousemove_"+id)){
					slider_thumb.classList.add("slider_mousemove_"+id);
				}
				slider_global = slider_pixelval/(slider_parent.clientWidth - slider_thumb.clientWidth)*slider_limits[0];
				args.events.mouseup();
			}
		}, true);

		function OnMouseDown(e) {
			e.preventDefault();
			isDown = true;
			slider_thumb.classList.remove("slider_mousemove_"+id);
			mousePosition = [e.clientX,0]; 
			offset = [slider_parent.getBoundingClientRect().left + slider_thumb.clientWidth/2,0];
			slider_thumb.style.transform = "translate(" + (mousePosition[0] - slider_parent.getBoundingClientRect().left - slider_thumb.clientWidth/2) + 'px)';
			slider_pixelval = (mousePosition[0] - slider_parent.getBoundingClientRect().left - slider_thumb.clientWidth/2);
		}

		slider_fill_left.addEventListener('mousedown',function(e){
			OnMouseDown(e);
			args.events.mousedown();
			allowed = false;
		});

		slider_fill_right.addEventListener('mousedown',function(e){ 
			OnMouseDown(e);
			args.events.mousedown();
			console.log("down");
			allowed = false;
		});
		
		var slider_get_meth = function(){
			var value = slider_pixelval/(slider_parent.clientWidth - slider_thumb.clientWidth)*slider_limits[0];
			if(value < min){
					return min;
				}else if(value > max){
					return max;
				}else{
					return value;
				}
		}

		var slider_update_meth = function(val){
			slider_global = val;
			var slider_temp = ((val/slider_limits[0])*(slider_parent.clientWidth - slider_thumb.clientWidth));
			slider_thumb.style.transform = "translate(" + slider_temp + 'px)';
			slider_pixelval = slider_temp;
		}
		window.addEventListener("resize", async function(){
			allowed = false;
			slider_update_meth(slider_global);
			await sleep(rate);
			allowed = true;
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