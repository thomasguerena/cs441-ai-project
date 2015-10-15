(function () {
	'use strict';

	window.Antibiotic = function () {
		// TODO - randomaly assign a new center
		this.center = 2048; // ~ middle of 0 and 4906;
		this.leniency = 128;
	};

	Antibiotic.prototype.chanceOfSurvival = function(cell) {
		var c = this.center;
    	var l = this.leniency;
    	var x = strToHex(cell.dna); // dna as decimal value
    	var offset = Math.abs(c - x); // distance from center
    	offset = Math.min(offset, l); // reduce offset
    	offset = offset / l; // scale offset
    	offset = Math.min(offset, 1); // limit offset
    	return Math.max(0.1, 1 - offset); // propability of survival = 1 - fitness
	};
})();