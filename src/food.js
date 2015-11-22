(function () {
	'use strict';

	window.Food = function (x, y) {
		this.x = x;
		this.y = y;
		this.sustenance = settings.food.sustenance;

		if (this.x == undefined || this.y == undefined) {
			var rx = new Array(environment.w);
			var ry = new Array(environment.h);
			for (var i = 0; i < environment.w; ++i) rx[i] = i;
			for (var i = 0; i < environment.h; ++i) ry[i] = i;
			rx = knuthShuffle(rx);
			ry = knuthShuffle(ry);

			for (var i = 0; i < rx.length; ++i) {
				for (var j = 0; j < ry.length; ++j) {
					if (environment.antibioticMatrix[rx[i]][ry[j]] < 0
					 && environment.bacteriaMatrix[rx[i]][ry[j]] < 0
					 && environment.foodMatrix[rx[i]][ry[j]] < 0) {
						this.x = rx[i];
						this.y = ry[j];
						return;
					}
				}
			}
		}
	};

	Food.prototype.munch = function() {
		var bitesize = 10; // not BYTE size...
		this.sustenance -= bitesize;
		return bitesize;
	};

	Food.prototype.update = function () {
		if (this.sustenance < 1) {
			environment.remove(this);
		}
	};

})();