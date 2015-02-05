/*-----------------------------global variables------------------------------*/

var c = document.getElementById("renderWindow");
var cx = c.getContext("2d");
var levelSel = document.getElementById("level");
var form = document.getElementById("form");
var time, clicks, startType=0;

/*--Document Variables-------------------------------------------------------*/

var currDisplay = document.getElementById("main");
var prevDisplay;
var currGame = new GrineerHacker();

/*--------------------------------interrupts---------------------------------*/

document.onkeydown = keydown;
function keydown(evt) {
    if (!evt) evt = event;
    if (evt.keyCode == 32) {
    	if(currGame != undefined){
        	currGame.activate();
    	}
    }else if (evt.keyCode == 27 && currDisplay == document.getElementById("game")) { // esc key, pause if game is displayed
        display('PAUSE');
    }
}

/*--HTML Callbacks----------------------------------------------------------*/

var display = function(option){
	console.log(option);
	var tmpDisplay = currDisplay;

	if(option == "PREV"){
		currDisplay = prevDisplay;
	}else if(option == "RESUME"){
		currGame.resumeGame();
		currDisplay = document.getElementById("game");
	}else if(option == "START"){

		if(startType == 1){ // level start
			var level = parseInt(levelSel.value);
			var wedges = 8;
			var speed = level + 2;
			var consRot = true;
			if(level < wedges){
				wedges = level;
			}
			if(level > 5){
				consRot = false;
			}

			currGame.StartGame(cx, wedges, speed, consRot, display, "END");
		}else if(startType == 2){ // endless start
			currGame.StartGame(cx, 1, 3, true, nextGame, undefined);
		}else if(startType == 3){ // custom start
			var wedges = parseInt(form.wedges.value);
			var speed = parseInt(form.speed.value);
			var consRot = form.consrot.checked;

			currGame.StartGame(cx, wedges, speed, consRot, display, "END");
		}

		currDisplay = document.getElementById("game");
	}else if(option == "PAUSE"){
		currGame.pauseGame();
		currDisplay = document.getElementById("pause");
	}else if(option == "END"){
		currGame.endGame();
		if(currGame.stats.won){
			document.getElementById("results").innerHTML = "You Won!";
		}else{
			document.getElementById("results").innerHTML = "Game Ended.";
		}
		document.getElementById("stats").innerHTML = "Time Elapsed: " + currGame.stats.timer + " seconds" + "<br />Clicks: " + currGame.stats.clicks + "<br />Speed: " + currGame.speed;
		currDisplay = document.getElementById("end");
	}else{
		currDisplay = document.getElementById(option);
	}

	tmpDisplay.style.display = "none";
	currDisplay.style.display = "inline";
	prevDisplay = tmpDisplay;
}

function levelStart(){
	startType = 1;
	display('START');
}

function endlessStart(){
	startType = 2;
	display('START');
}

function customStart(){
	startType = 3;
	display('START');
}

/*--Functions----------------------------------------------------------------*/

var nextGame = function(){
	if(!currGame.stats.won){ // if you won on endless, continue, else show end screen
		display('END');
		return;
	}
	var wedges = currGame.numWedges;
	if(wedges < 8){
		wedges++;
	}
	var speed = currGame.speed;
	speed++;
	var consRot = currGame.constRot;
	if(wedges > 5){
		consRot = false;
	}
	currGame.StartGame(cx, wedges, speed, consRot, nextGame, undefined);
}

