class Slider{
	constructor(args){
		this.args = args
		this.globalval = -1
		console.log(args)
		var eventFlags = {
			thumb:false,
			back:false
		}
		var events = {
			thumb:true,
			back:true,
			setVal:true
		}

		var mouse = []
		var offset = []
		var obj_events = []
		var max = ObjIncludes(args,'max') || 100
		var min = 0

		var s_wrapper = $('<div>').attr('class','s-wrapper')
								  .css({
								  	'height':ObjIncludes(args,'slider_height') || 20,
								  	'width':ObjIncludes(args,'slider_width') || 200,
								  	'background-color':ObjIncludes(ObjIncludes(args,'colors'),'back_color') || "black"
								  })
		var s_front = $('<div>').attr('class','s-front')
								.css({
									'height':'100%',
									'background-color':ObjIncludes(ObjIncludes(args,'colors'),'front_color') || "teal"
								})
		var s_thumb = $('<div>').attr('class','s-thumb')
								.css({
									'height':ObjIncludes(args,'thumb_height') || ObjIncludes(args,'slider_height') || 20,
									'width':ObjIncludes(args,'thumb_width') || ObjIncludes(args,'slider_height') || 20,
									'background-color':ObjIncludes(ObjIncludes(args,'colors'),'thumb_color') || "pink"
								})

		s_thumb.on('mousedown',(e)=>{
			e.preventDefault()
			if(e.button == 0 && events.thumb){
				events.setVal = false
				eventFlags.thumb = true
				events.back = false
				offset = [s_thumb.mySLeft() - s_wrapper.mySLeft(),""]
				mouse = [e.clientX,e.clientY]
				s_front.removeClass("s-transition")
				s_thumb.removeClass("s-transition")
				//console.log(e)
			}
		})
		$(document).on('mousemove',(e)=>{
			//console.log([e.clientX,e.clientY])
			if(eventFlags.thumb && events.thumb){
				e.preventDefault()
				var pos = [e.clientX - mouse[0] + offset[0],""]
				if( -5 <= pos[0] && pos[0] <= s_wrapper.mySWidth() - s_thumb.mySWidth() + 5){
					s_thumb.css('left',pos[0])
					s_front.css('width',pos[0])
				}
				//console.log(pos[0])
			}
		}).on('mouseup',(e)=>{
			e.preventDefault()
			events.back = true
			if(eventFlags.thumb && e.button == 0){
				this.globalval = this.getValue_()
				doEvent("oninput")
				events.setVal = true
				s_front.addClass("s-transition")
				s_thumb.addClass("s-transition")
			}
			eventFlags.thumb = false
		})

		s_wrapper.on('mousedown',(e)=>{
			if(events.back){
				e.preventDefault()
				events.setVal = false
				s_front.removeClass("s-transition")
				s_thumb.removeClass("s-transition")
				let val = e.clientX - s_wrapper.mySLeft() - (s_thumb.mySWidth()/2)
				if(val < 0){
					val = 0
				}else if(val > s_wrapper.mySWidth() - s_thumb.mySWidth()){
					val = s_wrapper.mySWidth() - s_thumb.mySWidth()
				}
				s_thumb.css('left',val)
				s_front.css('width',val)
				this.globalval = this.getValue_();
				doEvent("oninput")
				events.setVal = true
				s_front.addClass("s-transition")
				s_thumb.addClass("s-transition")
				console.log('down')
			}
		})

		function setSize(){
			s_thumb.css('transform',`translateY(${((s_wrapper.mySHeight() + s_thumb.mySHeight())/2.0)*-1}px)`)
			s_front.css('width',0)
		}
		$(document).ready(()=>{
			setSize()
			$(window).on('resize',(e)=>{
				if(this.globalval != -1){
					this.value = this.globalval
				}
			})
		})

		this.value_ = (val) =>{
			let newVal = val * (s_wrapper.mySWidth() - s_thumb.mySWidth())/max
			if(newVal < 0){
				newVal = 0
			}else if(val > s_wrapper.mySWidth() - s_thumb.mySWidth()){
				newVal = val > s_wrapper.mySWidth() - s_thumb.mySWidth()
			}
			s_thumb.css('left',newVal)
			s_front.css('width',newVal)
		}

		this.getValue_ = () => {
			let val = (s_front.mySWidth()/(s_wrapper.mySWidth() - s_thumb.mySWidth()))*max
			if(val < 0){
				val = 0
			}else if(val > max){
				val = max
			}
			return val
		}
		this.addEvent_ = (e,callback)=>{
			obj_events.push({
				"e":e,
				"callback":callback
			})
		}
		function doEvent(e){
			for(let ev of obj_events){
				if(ev.e == e){
					ev.callback()
				}
			}
		}
		s_wrapper.append(s_front,s_thumb)
		s_front.addClass("s-transition")
		s_thumb.addClass("s-transition")
		this.object = s_wrapper 
		this.events = events
	}
	set value(val){
		if(this.events.setVal){
			this.value_(val)
			this.globalval = val
		}
	}
	get value(){
		return this.getValue_()
	}
	addEventListener(e,callback){
		this.addEvent_(e,callback)
	}
}
$.fn.mySHeight = function(){
	return this[0].getBoundingClientRect().height
};
$.fn.mySWidth = function(){
	return this[0].getBoundingClientRect().width
};
$.fn.mySLeft = function(){
	return this[0].getBoundingClientRect().left
};
function ObjIncludes(obj,key){
	if(!obj){
		return false
	}
	return (Object.keys(obj).includes(key)) ? obj[key] : false
}