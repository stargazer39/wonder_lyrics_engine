$.fn.textWidth = function(text, font) {
    if (!$.fn.textWidth.fakeEl) $.fn.textWidth.fakeEl = $('<span>').hide().appendTo(document.body);
    $.fn.textWidth.fakeEl.text(text || this.val() || this.text()).css('font', font || this.css('font'));
    return $.fn.textWidth.fakeEl.width();
};

function setWidth(elem){
	extra_w = $("<input class='args.time'>").html('00').textWidth()
	//console.log(elem.textWidth() + extra_w)
	elem.css('width',elem.textWidth() + extra_w + "px")
}

class LyricsLine{
	constructor(args){
		this.args = args

		this.jq = $('<div>').attr('class','lyr-line');
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
		time_input = $('<input type="text">').attr('class','.time')
		if(args.time || args.time == 0){
			time_input.html(" " + args.time).css('display','inline-block')
		}else{
			time_input.css('display','none')
		}

		if(!args.content) args.content = '[pause]';
		let lyr_input = $('<input type="text">').attr('disabled',true).attr('class','lyrics_input').val(args.content)
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
			this.args.lyr_div_click(this.args.time)
		})
		sel_div.on('click',(e) => {
			this.args.select_div_click(this.jq)
		})
		add_div.on('click',(e) =>{
			this.args.add_button(this.jq,this.args)
		})
		this.jq.append(add_div,rem_div,sel_div,lyr_div,time_div)
		//add_div.on('click',addElem)
		//sel_div.on('click',lyrClick)
		//lyr_div.on('click',seekToLyr)
		//rem_div.on('click',removeElem)

		//time_input.on('focusout',checkVal)
		//lyr_input.on('focusout',editElem)
	}
	set time(val){
		this.args.time = val
		this.jq.find('.time').val(" " + val)
	}
}
var parent = $('#formatted-lyrics')
var objects = []
//var timecode = []
//var lyrics_array = []
var selected = null

$('#ok').on('click',() => {
	var lyrics = $('#lyrics').val().split('\n')
	$('#frame-3').css('display','none')
	for(let each of lyrics){
		let args = {
			'content':each.trim(),
			'time':false,
			'add_button':addAfter,
			'remove_button':removeElem,
			'select_div_click':selectElem,
			'lyr_div_click':seekToElem
		}
		var obj = new LyricsLine(args)
		console.log(obj.jq.css('backgroud-color','white'))
		obj.jq.appendTo(parent)
		
		objects.push(obj)
	}
})

//lyrics_array.push(args.content)
//timecode.push(args.time)

function addAfter(elem,args){
	args.content = "new line2"
	var index = elem.index()
	if(index < objects.length) args.time = false;
	var newLine = new LyricsLine(args)
	newLine.jq.insertAfter(elem)
	objects.splice(index+1,0,newLine)
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
	if(time || time == 0) player.currentTime =  time;
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
	objects[current].time = player.currentTime
	current++
}
var j = 0,sync = 0
var stop_update

function selectLine(index){
	$('.lyr-line').css('border','none')
	objects[index].jq.css('border','1px solid white')
	//objects[index].jq.css('background-color','white')
}

function update(argument) {
	if(player.currentTime + sync > objects[j].time && player.currentTime + sync < objects[j+1].time){
		selectLine(j)
		//console.log(j)
		j++
		stop_update = false
	}
	if(j == objects.length - 1 && player.currentTime > objects[j].time && !stop_update){
		selectLine(j)
		stop_update = true
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
	//player.pause();
	done = false;
	console.log("seeking")
	j = 0;
	//something had to change
	objects.forEach(check);
	//player.play();
}
function check(item,index) {
	item = item.args.time
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