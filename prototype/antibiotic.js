(function () {
	'use strict';

	window.Antibiotic = function () {
		this.center = 2048; // ~ middle of 0 and 4906;
		this.leniency = 64; // uneffective range
	};

    // Reposition the antibiotic's weakness
    Antibiotic.prototype.set = function (center) {
        this.center = center;
    };

	Antibiotic.prototype.chanceOfSurvival = function(cell) {
		var c = this.center;
    	var l = Math.max(this.leniency - 2*Math.floor(generation/10), 0);
    	var x = strToHex(cell.dna); // dna as decimal value
    	var offset = Math.abs(c - x); // distance from center
    	offset = Math.min(offset, l); // reduce offset
    	if (offset > 0) {
    		offset = offset / l; // scale offset
    		offset = Math.min(offset, 1); // limit offset
    		return Math.max(0.1, 1 - offset); // propability of survival
    	} else {
    		return x === c ? 1 : 0.1;
    	}


	};
})();