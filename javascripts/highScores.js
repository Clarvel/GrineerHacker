/*--HighScore update Thread--------------------------------------------------*/

function Entry(ident, score, level, clicks, timer){
	this.ident = ident;
	this.score = score;
	this.level = level;
	this.clicks = clicks;
	this.timer = timer;
}

var Scores = function(maxSize, tableId){
	this.tableId = tableId;
	this.maxSize = maxSize; // max size of entries array
	this.entries = [];

	if(typeof(Storage) !== "undefined"){ // load locally stored entries if possible
		if(localStorage.scoreEntries){
			//console.log(localStorage);
			this.entries = JSON.parse(localStorage.scoreEntries);
			//console.log("loading entries:");
			//console.log(this.entries);
		}
	}else{
		alert("Your Web Browser does not support local storage, high-scores will not be saved");
	}

	this.addNew = function(entry){
		if(entry == undefined){
			return false;
		}
		console.log(entry);
		var newHighScore = false; //!Boolean(this.entries.length); // set to true if 0 entries, false otherwise
		for(var a = 0; a < this.entries.length; a++){ // insert into list
			if(this.entries[a].score < entry.score){
				console.log("score " + a);
				entry.ident = prompt("New High Score! Please enter name:");
				this.entries.splice(a, 0, entry); // add new entry
				newHighScore = true;
				a = this.entries.length;
			}
		}
		if(!newHighScore && this.entries.length < this.maxSize){ // if available last place, add score to end
			console.log("score2 ");
			console.log(entry);
			entry.ident = prompt("New High Score! Please enter name:");
			this.entries[this.entries.length] = entry;
			newHighScore = true;
		}
		if(this.entries.length > this.maxSize){
			this.entries = this.entries.slice(0, this.maxSize); // remove last entry
		}

		if(typeof(Storage) !== "undefined"){ // save locally stored entries if possible
			localStorage.scoreEntries = JSON.stringify(this.entries);
		}
		return newHighScore;
	}

	this.writeToTable = function(){
		var str = "<table><tr><th>Name</th><th>Score</th><th>Level</th><th>Clicks</th><th>Time</th></tr>";
		for(var a = 0; a < this.entries.length; a++){ // global list of entries
			str += 	"<tr><td>"  + this.entries[a].ident + 
					"</td><td>" + this.entries[a].score + 
					"</td><td>" + this.entries[a].level + 
					"</td><td>" + this.entries[a].clicks + 
					"</td><td>" + this.entries[a].timer + 
					"</td></tr>";
		}
		str += "</table>";
		document.getElementById(this.tableId).innerHTML = str;
	}

	this.resetScores = function(){
		localStorage.removeItem("scoreEntries");
		this.entries = [];
	}
}
