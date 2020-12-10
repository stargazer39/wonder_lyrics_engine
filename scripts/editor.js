$.fn.textWidth = function(text, font) {
    if (!$.fn.textWidth.fakeEl) $.fn.textWidth.fakeEl = $('<span>').hide().appendTo(document.body);
    $.fn.textWidth.fakeEl.text(text || this.val() || this.text()).css('font', font || this.css('font'));
    return $.fn.textWidth.fakeEl.width();
};

function setWidth(elem){
	extra_w = $("<input class='props.time'>").html('00').textWidth()
	//console.log(elem.textWidth() + extra_w)
	elem.css('width',elem.textWidth() + extra_w + "px")
}

class LyricsLine{
	constructor(props){
		this.props = props

		var jq = $('<div>').attr('class','lyr-line');
		var time_input
		/*let imageadd = $('<img>')
		let imageremove = $('<img>')
		imageadd.attr('src','assets/add.svg')
		imageremove.attr('src','assets/remove.svg')*/
		var add_div = $('<div>').attr('class','add').html('+')
		var rem_div = $('<div>').attr('class','remove').html('-')
		//let edit_div = $('<div>').attr('class','edit').html('E')
		var sel_div = $('<div>').attr('class','select').html('>')
		var lyr_div = $('<div>').attr('class','lyr')
		var time_div= $('<div>')
		time_div.attr('class','input-div')
		time_div.on('input',(e) => {
				setWidth($(e.target))
		});
		var time_input = $('<input type="text">').attr('class','time')
		if(typeof(props.time) == "number"){
			time_input.val(" " + props.time).css('display','inline-block')
		}else{
			time_input.css('display','none')
		}

		if(!props.content) props.content = '[pause]';
		let lyr_input = $('<input type="text">').attr('disabled',true).attr('class','lyrics_input').val(props.content)
		lyr_input.on('input',(e) => {
				setWidth($(e.target))
			});
		setWidth(lyr_input)
		setWidth(time_input)
		/*imageadd.appendTo(add_div)
		imageremove.appendTo(span)*/

		time_input.appendTo(time_div)
		lyr_input.appendTo(lyr_div)
		lyr_div.on('click',(e) => {
			this.props.lyr_div_click(this.props.time)
		})
		sel_div.on('click',(e) => {
			this.props.select_div_click(this.jq)
		})
		add_div.on('click',(e) =>{
			this.props.add_button(this.jq)
		})
		jq.append(add_div,rem_div,sel_div,lyr_div,time_div)
		this.jq = jq
		//add_div.on('click',addElem)
		//sel_div.on('click',lyrClick)
		//lyr_div.on('click',seekToLyr)
		//rem_div.on('click',removeElem)

		//time_input.on('focusout',checkVal)
		//lyr_input.on('focusout',editElem)
	}
	set time(value){
		this.props.time = value
		let time_div = this.jq.find('.time').css('display','inline-block')
		time_div.val(" " + value)
		setWidth(time_div)
	}
}
var parent = $('#formatted-lyrics')
var objects = []
function getObjTLength(){
	var len = 0
	for(let each of objects){
		if(typeof(each.props.time) == "number") len++;
	}
	return len
}
//var timecode = []
//var lyrics_array = []
var selected = null

$('#ok').on('click',() => {
	var lyrics = $('#lyrics').val().split('\n')
	$('#frame-3').css('display','none')
	for(let each of lyrics){
		let props = {
			'content':each.trim(),
			'time':false,
			'add_button':addAfter,
			'remove_button':removeElem,
			'select_div_click':selectElem,
			'lyr_div_click':seekToElem
		}
		var obj = new LyricsLine(props)
		console.log(obj.jq.css('backgroud-color','white'))
		obj.jq.appendTo(parent)
		
		objects.push(obj)
	}
})

//lyrics_array.push(props.content)
//timecode.push(props.time)

function addAfter(elem){
	var index = elem.index()
	console.log(index)
	var value = false
	var breakit = true
	if(index < getObjTLength() - 1){
		value = prompt(`Enter Vaue Between ${objects[index].props.time} - ${objects[index + 1].props.time}`)
		if(value){
			value = parseFloat(value.trim())
			if(value == NaN){
				breakit = true
			}else if((objects[index].props.time < value) && (value < objects[index + 1].props.time)){
				breakit = false
			}
		}else{
			breakit = true
		}
	}else{
		breakit = false
	}
	if(!breakit){
		let props = {
			'content':"New",
			'time':value,
			'add_button':addAfter,
			'remove_button':removeElem,
			'select_div_click':selectElem,
			'lyr_div_click':seekToElem
		}
		var newLine = new LyricsLine(props)
		newLine.jq.insertAfter(elem)
		objects.splice(index+1,0,newLine)
		console.log('Added to ' + (index+1))
		console.log(props)
	}
	
}
function removeElem(index){
	objects[index].jq.remove()
	if(index < timecode.length) objects.splice(index,1);
	objects.splice(index,1)
}

function selectElem(elem){
	console.log(elem)
	$('.lyr-line').css('background-color','#ffffff00')
	elem.css('background-color','white')
	selected = elem.index()
	console.log(selected)
}
function seekToElem(time){
	console.log(time)
	if(typeof(time) == "number") player.currentTime =  time;
}

var current = 0
$('#next-apply').on('click',() =>{
	nextApply()
})
$(window).on('keypress',(e) =>{
	console.log(e.key)
	switch(e.key){
		case "n":
			nextApply()
			break;
	}
})
function nextApply(){
	if(current == 0){
		objects[current].time = player.currentTime
		current++
	}else if(objects[current - 1].props.time < player.currentTime){
		objects[current].time = player.currentTime
		if(objects.length > current) current++;
	}else{
		alert('time has to be bigger than previous')
	}
}
function change(){

}
var j = 0,sync = 0
var stop_update

function selectLine(index){
	$('.lyr-line').css('border','none')
	objects[index].jq.css('border','1px solid white')
	//objects[index].jq.css('background-color','white')
}

function update(argument) {
	if(player.currentTime + sync > objects[j].props.time && player.currentTime + sync < objects[j+1].props.time){
		selectLine(j)
		//console.log(j)
		j++
		stop_update = false
	}
	if(j == getObjTLength() -1 && player.currentTime > objects[j].props.time && !stop_update){
		selectLine(j)
		stop_update = true;
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

var done
seek = function(){
	stop_update = false
	//player.pause();
	done = false;
	console.log("seeking")
	j = 0;
	//something had to change
	objects.forEach(check);
	//player.play();
}
function check(item,index) {
	item = item.props.time
	if(item > player.currentTime + sync && !done){
		j = index - 1;
		//console.log(index + 'kkkkkkkkkkkk');
		if(j<0){
			j=0;
		}
		done = true;
		selectLine(j)
	}
}
player.addEventListener("seeked", async function() {seek(); start();player.play();});
player.addEventListener("play",function() {seek(); start(); /*animation1();*/});
player.addEventListener("pause",function(){stop();});
player.addEventListener("ended",function(){ console.log("ended"); stop();});