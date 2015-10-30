(function () {
	'use strict';

	// Shuffle array using Knuth Shuffle method
	window.knuthShuffle = function (l) {
		var i = l.length, t, ri;
		while (0 !== i) {
			ri = Math.floor(Math.random()*i);
			i -= 1;
			t = l[i];
			l[i] = l[ri];
			l[ri] = t;
		}
		return l;
	};

	window.removeCellsFromList = function (cells, list) {
		if (!(cells instanceof Array)) cells = [cells];

		for (var i = 0; i < cells.length; ++i) {
			list = list.filter(function (toMatch) {
				if (toMatch.cid === cells[i].cid) return false;
				else return true;
			});
		}
		return list;
	};
})();