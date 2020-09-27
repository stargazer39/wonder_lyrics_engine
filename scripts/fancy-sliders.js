
class Slider {
	constructor(id,min,max){
		this.id = id;
		this.min = min;
		this.max = max;

		var slider_global;
		var slider_pixelval;

		var offset = [];
		var isDown = false;
		var mousePosition = [];
		var slider_limits = [];
		var allowed = true;

		var slider_parent = document.querySelector("#" + this.id)
		var slider_fill_left = document.querySelector("#" + this.id + " .slider_fill_left");
		var slider_fill_right = document.querySelector("#" + this.id + " .slider_fill_right");
		var slider_thumb = document.querySelector("#" + this.id + " .thumb");

		slider_limits = [ this.max, this.min ];

		slider_thumb.addEventListener('mousedown', function(e) { 
			//console.log("down"); 
			allowed = false;
			isDown = true;
			slider_thumb.classList.remove("slider_mousemove");
			offset = [slider_parent.offsetLeft - (slider_thumb.clientWidth/2),0];
		}, true);

		function sleep(ms) {
		  return new Promise(resolve => setTimeout(resolve, ms));
		}
		function OnMouseDown(e) {
			e.preventDefault();
			isDown = true;
			slider_thumb.classList.remove("slider_mousemove");
			mousePosition = [e.clientX - slider_thumb.clientWidth + document.scrollingElement.scrollLeft,0]; 
			slider_thumb.style.transform = "translate(" + (mousePosition[0] - slider_parent.offsetLeft + (slider_thumb.clientWidth/2)) + 'px)';
			slider_pixelval = (mousePosition[0] - slider_parent.offsetLeft + (slider_thumb.clientWidth/2));
		}

		slider_fill_left.addEventListener('mousedown',function(e){
			OnMouseDown(e)
			allowed = false;
			//console.log("down");
			//console.log(slider_pixelval[0]);
		});

		slider_fill_right.addEventListener('mousedown',function(e){ 
			OnMouseDown(e);
			console.log("down");
			allowed = false;
			//console.log(slider_pixelval[0]);
		});
		document.addEventListener('mousemove', function(e) {
			e.preventDefault(); 
			//allowed = false;
			//console.log("moving"); 
			if (isDown) {
				 mousePosition = [e.clientX - slider_thumb.clientWidth + document.scrollingElement.scrollLeft,0]; 
				 slider_thumb.style.transform = "translate(" + (mousePosition[0] - offset[0]) + 'px)'; 
				 slider_pixelval = (mousePosition[0] - offset[0]);
				 //console.log(slider_pixelval[0]);
				}
		}, true);

		document.addEventListener('mouseup', function() { 
			//console.log("up");
			if(isDown){
				allowed = true;
				isDown = false; 
				slider_thumb.classList.add("slider_mousemove");
				slider_global = slider_pixelval/(slider_parent.clientWidth - slider_thumb.clientWidth)*slider_limits[0];
				if(slider_global < min){
					window.slider_stateChanged(0,id);
				}else if(slider_global > max){
					window.slider_stateChanged(max,id);
				}else{
					window.slider_stateChanged(slider_global,id);
				}
			}
		}, true);

		var slider_get_meth = function(){
			return slider_pixelval/(slider_parent.clientWidth - slider_thumb.clientWidth)*slider_limits[0];
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
			await sleep(1000);
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

document.documentElement.style.setProperty('--slider_thumb-w' , '20px')
document.documentElement.style.setProperty('--slider_height' , '20px')