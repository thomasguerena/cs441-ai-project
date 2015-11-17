(function () {
	'use strict';

	window.Antibiotic = function (x, y, potency) {
        this.x = x > -1 ? x : Math.floor(Math.random()*16);
        this.y = y > -1 ? y : Math.floor(Math.random()*16);
        this.potency = potency > -1 ? potency : 150;
        this.diffused = false;
	};

    /* @description Decides whether or not it kills
     *   a bacteria cell. If it doesn't kill the cell,
     *   this antibiotic will be destroyed.
     * @oaram {Bacteria} cell
     * @returns {Boolean}
     *   True: It kills the bacteria.
     *   False: It does NOT kill the bacteria.
    */
	Antibiotic.prototype.kills = function(cell) {
		if (cell.diversity < this.potency) {
            this.destroy();
            return false;
        } else {
            return true;
        }
	};
})();