/*--HighScore update Thread--------------------------------------------------*/


function entry(xml){
	this.ident = xml.getElementsByTagName('name')[0].childNodes[0].nodeValue;
	this.score = xml.getElementsByTagName('score')[0].childNodes[0].nodeValue;
	this.level = xml.getElementsByTagName('level')[0].childNodes[0].nodeValue;
	this.clicks = xml.getElementsByTagName('clicks')[0].childNodes[0].nodeValue;
	this.timer = xml.getElementsByTagName('time')[0].childNodes[0].nodeValue;

	this.toHTML = function(){
		return "<tr><td>" + this.ident + "</td><td>" + this.score + "</td><td>" + this.level + "</td><td>" + this.clicks + "</td><td>" + this.timer + "</td></tr>";
	}
}

var scoresUpdate = function(){
	var xmlDoc = loadXML("scores.xml");

	var str = "<table><tr><th>Name</th><th>Score</th><th>Level</th><th>Clicks</th><th>Time</th></tr>";

	var entries = xmlDoc.getElementsByTagName('entry');
	var entriesArr = [];
	console.log(entries);
	for(var a = 0; a < entries.length; a++){ // global list of entries
		entriesArr[a] = new entry(entries[a]);
		console.log(entriesArr[a]);
		str += entriesArr[a].toHTML();
	}
	str += "</table>";
	//console.log("[" + str + "]");
	document.getElementById('scoreslist').innerHTML = str;
}

//var updatethread = setInterval(function(){scoresUpdate();}, 2000);
var blah = scoresUpdate();
