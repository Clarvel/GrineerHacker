/*-----------------------------global variables------------------------------*/

var c = document.getElementById("renderWindow");
var cx = c.getContext("2d");
var levelSel = document.getElementById("level");
var timer = 0;

/*--------------------------------interrupts---------------------------------*/

document.onkeydown = keydown;
function keydown(evt) {
    if (!evt) evt = event;
    if (evt.keyCode == 32) {
    	if(currGame != undefined){
        	currGame.activate();
    	}
    }else if (evt.keyCode == 27 && !paused) { // esc key
        display('PAUSE');
    }
}

/*--Document Variables-------------------------------------------------------*/

var currDisplay = document.getElementById("main");
var prevDisplay;
var paused = true;
var currGame = new GrineerHacker();

/*--HTML Callbacks and Event Listeners---------------------------------------*/

function display(option){
	var tmpDisplay = currDisplay;

	if(option == "PREV"){
		currDisplay = prevDisplay;
	}else if(option == "RESUME"){
		paused = false;
		currDisplay = document.getElementById("game");
		currGame.stats.timer += (new Date().getTime() - timer);
	}else if(option == "START"){
		paused = false;
		currDisplay = document.getElementById("game");
		if(levelSel.value == 0){
			currGame.StartGame(cx, 1, 3, true, true);
		}else{
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

			currGame.StartGame(cx, wedges, speed, consRot, false);
		}

	}else if(option == "PAUSE"){
		timer = new Date().getTime();
		paused = true;
		currDisplay = document.getElementById("pause");
	}else if(option == "END"){
		paused = true;
		if(currGame.stats.won){
			document.getElementById("results").innerHTML = "You Won!";
		}else{
			document.getElementById("results").innerHTML = "Game Ended.";
			currGame.stats.timer = (timer - currGame.stats.timer - currGame.pauseTime)/1000;
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