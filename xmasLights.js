/**!
 *
 * Espurino Xmas Light hack
 * ========================
 * Created 2017-12-23 by Huntly Cameron <huntly.cameron@gmail.com>
 * Blinky, binky lights. Inspired by late 90's web design, lol.
 *
 *
 *
 *
 *
 *
 *          DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
 *                    Version 2, December 2004
 *
 * Copyright (C) 2004 Sam Hocevar <sam@hocevar.net>
 *
 * Everyone is permitted to copy and distribute verbatim or modified
 * copies of this license document, and changing it is allowed as long
 * as the name is changed.
 *
 *            DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
 *   TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION
 *
 *  0. You just DO WHAT THE FUCK YOU WANT TO.
 *
 **/


function XmasLights(){
	this.isLightsOn = false; //Current Light state
	this.currentMode = 0; // 0 - repeating pattern, 1 - steady blink, 2 - just randomly fuck your shit up.
	this.itterCount = 0; //Just doing a global itteration count
	this.intervalVal = 250; //init value, but keep track of the current value
	this.currentTimeoutID = undefined; //the currently set timeout ID
}

XmasLights.prototype.run = function(){
	var _self = this;

	//setup on board btn watch for state change
	setWatch(function(){_self.toggleMode();}, BTN1, true);

	//Turn on!
	this.toggleLightState();
};

XmasLights.prototype.toggleMode = function() {
	//Only run on button down, not button up
	if(digitalRead(BTN1) === 1){
		this.currentMode++;

		//Mode only 0, 1, or 2 and will loop back
		if(this.currentMode > 2){
			this.currentMode = 0;
		}
	}
};

XmasLights.prototype.toggleLightState = function () {
	var _self = this;

	this.isLightsOn = !this.isLightsOn;

	//Lights hooked up to pin A1 (3.3v)
	A1.write(this.isLightsOn);

	if(this.currentTimeoutID !== undefined){
		clearTimeout(this.currentTimeoutID);
	}

	this.currentTimeoutID = setTimeout(function(){ _self.toggleLightState(); }, this.getModeTimeoutVal());
};

XmasLights.prototype.getModeTimeoutVal = function(){
	switch(this.currentMode){
		case 0: // Patteren mode
			switch(this.itterCount++){
				case 1: this.intervalVal = 200; break;
				case 8: this.intervalVal = 500; break;
				case 16: this.intervalVal = 300; break;
				case 24: this.intervalVal = 100; break;
				case 48:
					this.intervalVal = 600;
					this.itterCount = 0; // again, again! again, again!
					break;
			}
			break;
		case 1: // Steady blinky blinks
			this.intervalVal = 500;
			break;
		case 2: // fuck your shit up with random light on durations
			if(this.isLightsOn){
				this.intervalVal = Math.ceil(Math.random() * 1000);
			}else{ //dont keep fam waiting for the shit show
				this.intervalVal = 200;
			}
			break;

	}

	return this.intervalVal;
};

var xmasLights = new XmasLights();
xmasLights.run();
