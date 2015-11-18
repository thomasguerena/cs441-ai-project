(function () {
	'use strict';

	window.Antibiotic = function (x, y, potency) {
        this.x = x > -1 ? x : Math.floor(Math.random()*16);
        this.y = y > -1 ? y : Math.floor(Math.random()*16);
        this.potency = potency > -1 ? potency : settings.antibiotic.potency;
        this.diffused = false;
	};

    Antibiotic.prototype.spread = function () {
        if (generation < settings.antibiotic.genx) return;
        if (this.diffused == true) return;
        if (this.potency - settings.antibiotic.diffusal < 0) return;

        var emptyAdj = environment.getEmptyAdjacent(this);
        var availableSpread = emptyAdj.antibiotic.intersect(emptyAdj.food,
            function (a, b) {
                return a.x == b.x && a.y == b.y;
        });

        for (var i = 0; i < availableSpread.length; ++i) {
            environment.add(new Antibiotic(
                availableSpread[i].x,
                availableSpread[i].y,
                this.potency - settings.antibiotic.diffusal
            ));
        }
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
		return this.potency > cell.diversity;
	};
})();