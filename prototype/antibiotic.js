(function () {
	'use strict';

	window.Antibiotic = function () {
		// TODO - randomaly assign a new center
		this.center = 2048; // ~ middle of 0 and 4906;
		this.leniency = 100;
	};

	Antibiotic.prototype.chanceOfSurvival = function(cell) {
		var gvalue = strToHex(cell.dna); // dna as decimal value
		var offset = Math.abs(this.center - gvalue); // distance from center
		var poffset = Math.min(offset / this.leniency, 1); // percentage offset from center
		poffset = poffset * poffset; // square the result
		var psurvival = Math.max(1 - poffset, 0.05); // inverse, min 5% chance

		// console.log('\nInducing cell: ' + cell.cid); //rmv
		// console.log(gvalue, offset, poffset); //rmv
		// console.log('psurvival = ' + psurvival); //rmv

		return psurvival;
	};
})();