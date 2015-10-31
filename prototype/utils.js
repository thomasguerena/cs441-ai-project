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

	/* @description Only push the item if it does not exist
	 * already in the array. Duplicates are identified using
	 * the comparison function parameter.
	 *
	 * @param {any} item: The element to be pushed onto the array.
	 * @param {function} compare: Function which accepts two items
	 *   from the array and returns true when they match, and false
	 *   otherwise. The first parameter will always be the item which
	 *   is being added to the array.
	 *
	 * @returns {Boolean}
	 *   true: The item was added to the array.
	 *   false: The item was NOT added to the array.
	*/
	Array.prototype.pushUnique = function (item, compare) {
	    if (typeof item == undefined) return false;
	    if (typeof compare != 'function') {
	    	console.error('Invalid comparison function');
	    	return false;
	    }
	    for (var i = 0; i < this.length; ++i) {
	        if (compare(item, this[i]) === true) return false;
	    }
	    this.push(item);
	    return true;
	};
})();