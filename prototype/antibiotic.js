(function () {
	'use strict';

	window.Antibiotic = function (x, y, potency) {
        this.x = x > -1 ? x : Math.floor(Math.random()*16);
        this.y = y > -1 ? y : Math.floor(Math.random()*16);
        this.potency = potency || 100;
	};

    /* @description Decides whether or not it kills
     *   a bacteria. If it doesn't this antibiotic
     *   will be wiped out.
     * @returns {Boolean}
     *   True: It kills the bacteria.
     *   False: It does NOT kill the bacteria.
    */
	Antibiotic.prototype.kill = function(cell) {
		return Math.random() < this.potency/100;
	};
})();