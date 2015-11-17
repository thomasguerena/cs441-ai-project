(function () {
	'use strict';

	window.Food = function (x, y) {
		this.x = x;
		this.y = y;
		this.sustenance = settings.food.sustenance;
	};

	Food.prototype.munch = function() {
		var bitesize = 10; // not BYTE size...
		this.sustenance -= bitesize;
		return bitesize;
	};

})();