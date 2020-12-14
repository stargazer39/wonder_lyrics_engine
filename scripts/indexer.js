class Song {
	constructor(song){
		this.song = song

		let songdiv = $('<div>')
		let detailsdiv = $('<div>')
		let singerdiv = $('<div>')
		let titlediv = $('<div>')
		let bacgrounddiv=$('<div>')


		bacgrounddiv.css('background-image','url(https://img.youtube.com/vi/' + song.ytid + '/0.jpg)')
		bacgrounddiv.addClass('song-background')
		songdiv.addClass('song')
		detailsdiv.addClass('song-details')
		
		detailsdiv.html(`${song.title} ft.${song.singer}`)
		bacgrounddiv.appendTo(songdiv)
		detailsdiv.appendTo(songdiv)

		songdiv.on('click',() => {
			window.open(song.link,'_self')
		})
		return songdiv
	}
}

async function Main(){
	var host = "https://wle-server.herokuapp.com/"
	var song_container = $('#song-container')
	var all_songs
	try{
		all_songs = await makeRequest('GET',`${host}?get=all_songs`)
	}catch{
		$('#status > div').html(`Server didn't respond. Please try again.`)
		throw `Server didn't respond`
	}
	
	await sleep(100)
	$('#status').css('width','0')
	await sleep(1100)
	$('#status').hide()
	$('#song-container').css('display','flex')
	all_songs = JSON.parse(all_songs)
	//var songs = [{'singer' : 'Hatsune Miku', 'title' : 'Wonder Style','link':'wonderplay - normal.html','ytid' : '1s8NNPgdl5g'},{'singer' : 'Hatsune Miku', 'title' : 'The World','link':'wonderplay - normal.html','ytid' : 'yb8WuMVGLBM'},{'singer' : 'Hatsune Miku', 'title' : 'Hand in Hand','link':'wonderplay - normal.html','ytid' : '9SKA6PmcLuQ'}]
	for(let song of all_songs){
		let s = new Song({
			"singer":song.singers[0],
			"title":song.names[0],
			"link":"wonderplay - player.html?song_id=" + song._id,
			"ytid":song.links.youtube
		})
		s.appendTo(song_container)
	}
	for(let i = 0; i < $('.song').length; i++){
		await sleep(150)
		$($('.song')[i]).addClass('state1')
	}
}
Main()