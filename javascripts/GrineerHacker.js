/*
Written By Matthew Russell
Last updated Feb 15, 2015
*/

/*-----------------------------global variables------------------------------*/

/*--------------------------------interrupts---------------------------------*/

/*------------------------------html callbacks-------------------------------*/

/*---------------------------helper functions--------------------------------*/

function rad(deg){
	//console.log("Rad: " + deg * Math.PI / 180 + " deg: " + deg);
	return deg * Math.PI / 180;
}

function resize(x, y){
	//console.log("resizing to [" + x + " " + y + "]");
	c.width = x;
	c.height = y;
}

function loadImgs(imgsHandler){
	var files = [imgsHandler.names.length];
	var listeners = [];
	for(var a = 0; a < imgsHandler.names.length; a++){ // load images
		//console.log("Loading image: " + imgsHandler.names[a]);
		var img = new Image();
		img.src = imgsHandler.path + imgsHandler.names[a] + imgsHandler.ext;
		files[a] = img;
	}
	imgsHandler.file = files;
}

function areImgsLoaded(imgsHandler){
	for(var a = 0; a < imgsHandler.file.length; a++){ // verify images loaded
		if(!imgsHandler.file[a].complete){
			console.log("Still loading Images...");
			return false;
		}
	}
	imgsHandler.loaded = true;
	return true;
}

/*-----------------------Grineer Hacking Minigame----------------------------*/

function GrineerHacker(){
	//console.log("Making Grineer instance");
	this.imgs = {
		names : ["wheel", "lock", "lock1", "spinner", "wedge", "wedge1"],
		path : "./images/grineerHacker/",
		ext : ".png",
		file : [],
		loaded :  false,
	};
	this.MAX_WEDGES = 8;
	this.spacing  = {
		margin : 50,
	};
	this.off = { // offsets for wedges
		wedge : 102,
		lock : 82,
		active : 41,
	}

	this.waitID = loadImgs(this.imgs); // load images

	this.reset = function(){
		//console.log("Resetting");
		if(this.renderer != undefined){
			clearInterval(this.renderer);
			this.renderer = undefined;
		}
		this.speed = 0;
		this.direction = 1;
		this.timerPos = -112.5;
		this.constRot = true;
		this.wedges = [this.MAX_WEDGES];
		this.wedSpdVal = 0; // number of wedges activated
		this.wedIncrem = 1; // value to multiply num wedges activated by to add to timer position
		this.spacePressed = false;
		this.paused = false;
		this.ended = false;
		this.pauseTime = 0;
		this.stats = {
			won : false,
			clicks : 0,
			timer : 0,
		}
	}

	this.StartGame = function(ctx, numWedges, startSpd, constRot, wedSpdInc, callback, callValue){ // starts game instance
		//console.log("Starting game: " + numWedges + " " + startSpd + " " + constRot);
		//console.log(this.imgs);
		this.reset();

		this.ctx = ctx;
		this.callback = callback;
		this.numWedges = numWedges;
		this.setWedges(numWedges);
		this.speed = startSpd;
		this.wedSpdInc = wedSpdInc;
		this.constRot = constRot;
		this.callValue = callValue;

		var a = this;
		if(!this.imgs.loaded){
			//alert("Images still loading...");
			console.log("Images still loading...");
			resize(50, 20);
			ctx.fillText("Loading...", 0, 16);
			this.renderer = setInterval(function(){a.finishedLoading(ctx);}, 50);
			return;
		}
		a.finishedLoading(ctx);
	}

	this.pauseGame = function(){
		// return id game is paused or no game has been started
		if(this.paused || this.renderer == undefined){
			return;
		}
		this.paused = true;

		this.pauseTime = new Date().getTime(); // to keep track of length of time paused

		clearInterval(this.renderer);
		this.renderer = undefined;
	}

	this.resumeGame = function(){
		// if game is not paused or the game is running
		if(!this.paused || this.renderer != undefined){
			return;
		}
		this.paused = false;

		var resumeTime = new Date().getTime(); // add paused time to timer stats
		this.stats.timer += (resumeTime - this.pauseTime);

		var a = this; // resume game
		this.renderer = setInterval(function(){a.drawFrame();}, 33.333); // draw new frame every 1/24s
	}

	this.endGame = function(){
		if(this.ended){
			return;
		}
		this.ended = true;
		console.log("game ended");

		if(this.renderer != undefined){
			clearInterval(this.renderer);
			this.renderer = undefined;
		}

		this.paused = true;

		this.speed = this.speed;
		var endTime = new Date().getTime();
		this.stats.timer = (endTime - this.stats.timer)/1000;

		console.log("\ttime elapsed: " + this.stats.timer + " seconds");
		console.log("\tclicks: " + this.stats.clicks);
		console.log("\tspeed: " + this.speed);
		if(this.callValue == undefined){
			this.callback();
		}else{
			this.callback(this.callValue);
		}
	}

	this.finishedLoading = function(){
		if(!areImgsLoaded(this.imgs)){
			return;
		}
		if(this.renderer != undefined){
			clearInterval(this.renderer);
			this.renderer = undefined;
		}

		this.dim = [2 * this.spacing.margin + this.imgs.file[this.imgs.names.indexOf("wheel")].width, 
				2 * this.spacing.margin + this.imgs.file[this.imgs.names.indexOf("wheel")].height];
		resize(this.dim[0], this.dim[1]);

		this.stats.timer = new Date().getTime();
		//this.drawFrame(ctx);
		if(this.renderer == undefined){
			console.log("starting game instance");
			var a = this;
			this.renderer = setInterval(function(){a.drawFrame();}, 33.333); // draw new frame every 1/24s
		}
	}

	this.checkGoalState = function(){ // return true or false whether goal reached
		for(var a = 0; a < this.wedges.length; a++){
			if(this.wedges[a] != undefined && this.wedges[a].active != undefined){
				if(!this.wedges[a].active){
					return false;
				}
			}
		}
		//console.log(this.wedges);
		return true;
	}

	this.drawFrame = function(){ // draws one frame for game
		//console.log("drawing frame");
		this.ctx.clearRect(0, 0, this.dim[0], this.dim[1]); // clear enough canvas for game
		//this.ctx.fillStyle = "black";
		//this.ctx.fillRect(0, 0, this.dim[0], this.dim[1]); // background
		this.ctx.fillStyle = "white";
		this.ctx.font = "12px Optima";
		this.ctx.fillText("Time: " + (new Date().getTime() - this.stats.timer)/1000 + " s", 10, 18);
		this.ctx.fillText("Lock Flips: " + this.stats.clicks, 10, 30);
		this.ctx.fillText("Speed: " + this.speed, 10, 42);

		var offset; // wedge offset var
		var img; // current img var

		var selWedge = Math.floor((this.timerPos+22.5)%360/45);

		//draw wheel
		this.ctx.drawImage(this.imgs.file[this.imgs.names.indexOf("wheel")], this.spacing.margin, this.spacing.margin);

		// translate to center
		this.ctx.translate(this.dim[0]/2, this.dim[1]/2);
		this.ctx.fillText("SPACE", -17, 5);

			// draw time indicator here
			this.ctx.rotate(rad(this.timerPos));
				img = this.imgs.file[this.imgs.names.indexOf("spinner")];
				var sMargin = this.spacing.margin / 2 - img.width / 2; // make spinner margin, assume spinner dimensions less than margin
				this.ctx.drawImage(img, this.imgs.file[this.imgs.names.indexOf("wheel")].height/2 + sMargin, -img.height/2);
			this.ctx.rotate(-rad(this.timerPos));

			// draw all wedges here
			//console.log(this.wedges);
			for(var a = 0; a < this.MAX_WEDGES; a++){
				if(this.wedges[a] != undefined && this.wedges[a].active != undefined){ // if wedge at position
					//console.log("drawing wedge " + a + "  " + [this.wedges]);
					// draw wedge
					img = this.imgs.file[this.imgs.names.indexOf("wedge")];
					offset = this.off.wedge;
					if(selWedge == a || 8 + selWedge == a){
						img = this.imgs.file[this.imgs.names.indexOf("wedge1")];
						if(this.spacePressed){
							if(this.wedges[a].active){
								this.wedSpdVal -= 1;
							}else{
								this.wedSpdVal += 1;
							}
							this.wedges[a].active = !this.wedges[a].active;
							if(!this.constRot){ // if not constant rotation
								if(this.direction == 1){ // swap direction multiplier
									this.direction = -1;
								}else{
									this.direction = 1;
								}
							}
							this.stats.clicks++;
						}
					}
					this.ctx.drawImage(img, offset, -img.height/2);

					// draw lock
					img = this.imgs.file[this.imgs.names.indexOf("lock")];
					offset = this.off.lock;
					if(this.wedges[a].active){ // if selected wedge, change to show that
						img = this.imgs.file[this.imgs.names.indexOf("lock1")];
						offset = this.off.active;
					}
					this.ctx.drawImage(img, offset, -img.height/2);

				}
				this.ctx.rotate(rad(360 / this.MAX_WEDGES)); // iterate over entire circle
			}
		this.ctx.translate(-this.dim[0]/2, -this.dim[1]/2);

		this.timerPos += this.speed * this.direction; // update timer position
		if(this.wedSpdInc){ // if speed should increase by number of wedges activated
			this.timerPos += this.wedIncrem * this.wedSpdVal * this.direction;
		}

		if(this.checkGoalState()){
			this.stats.won = true;
			this.endGame();
			return;
		}
		this.spacePressed = false;
	}

	this.setWedges = function(numWedges){
		//console.log("asked for " + numWedges + " wedges");
		for(var a = 0; a < this.MAX_WEDGES; a++){ // verify empty wedges list
			if(this.wedges[a] != undefined){
				a = this.MAX_WEDGES;
				this.wedges = [this.MAX_WEDGES];
			}
		}

		if(numWedges <= 0){ // error check on number of wedges
			numWedges = 0;
		}else if(numWedges > this.MAX_WEDGES){
			numWedges = this.MAX_WEDGES;
		}
		this.numWedges = numWedges;
		//console.log("making " + numWedges + " wedges");
		var pos = [this.MAX_WEDGES]; // setup array of available positions to possibly be filled
		for(var b = 0; b < this.MAX_WEDGES; b++){
			pos[b] = b;
		}
		for(var a = 0; a < numWedges; a++){	// setup array of wedges
			var rpos = Math.floor(Math.random() * (pos.length-1)); // randomly choose one of the available positions
			this.wedges[pos[rpos]] = { // set new wedge // ####
				active : false, // ####
			};
			pos.splice(rpos, 1); // remove that position from available list
		}
	}

	this.activate = function(){
		this.spacePressed = true;
	}
}