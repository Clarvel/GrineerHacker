AudioOverlapper = function(){
	this.play = function(audioObj){
		if(this[audioObj.src] == undefined){ // if track not in database
			this[audioObj.src] = [];
			this[audioObj.src][0] = audioObj.cloneNode();
			this[audioObj.src][0].play();
			return;
		}
		var a;
		for(a = 0; a < this[audioObj.src].length; a++){ // if track in database and idle tracks found
			if(this[audioObj.src][a].paused){
				this[audioObj.src][a].play();
				return;
			}
		}
		this[audioObj.src].push(audioObj.cloneNode()); // else add new track to list
		this[audioObj.src][a].play();
		console.log(this);
	}
}