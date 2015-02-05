/*--HighScore update Thread--------------------------------------------------*/


var entry = function(xml){
	this.ident = xml.getElementsByTagName('name')[0].childNodes[0].nodeValue;
	this.score = xml.getElementsByTagName('score')[0].childNodes[0].nodeValue;
	this.level = xml.getElementsByTagName('level')[0].childNodes[0].nodeValue;
	this.clicks = xml.getElementsByTagName('clicks')[0].childNodes[0].nodeValue;
	this.timer = xml.getElementsByTagName('time')[0].childNodes[0].nodeValue;

	this.toStr = function(){
		return this.ident + " " + this.score + " " + this.level + " " + this.clicks + " " + this.timer + "<br>";
	}
}

var scoresUpdate = function(){
	var xmlDoc = loadXML("scores.xml");

	var str = "";

	var entries = xmlDoc.getElementsByTagName('entry');
	console.log(entries);
	for(var a = 0; a < entries.length; a++){ // global list of entries
		entries[a] = new entry(entries[a]);
		str += entries[a].toStr();
	}
	console.log("[" + str + "]");
	document.getElementById('scoreslist').innerHTML = str;
}

//var updatethread = setInterval(function(){scoresUpdate();}, 2000);
var blah = scoresUpdate();
