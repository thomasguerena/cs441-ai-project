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

	/* @description Create a new array containing all the elements
	 * similar between the two arrays. Similar elements are identified
	 * using the comparison function parameter.
	 *
	 * @param {Array} array: The Array object with which to intersect.
	 * @param {Function} compare: Function which accepts two elements,
	 *   one from each array. It must return true when they are similar,
	 *   and false otherwise.
	 *
	 * @returns {Boolean}
	 *   true: The item was added to the array.
	 *   false: The item was NOT added to the array.
	*/
	Array.prototype.intersect = function (array, compare) {
		if (typeof array == undefined) return [];
		if (typeof compare != 'function') {
			console.error('Invalid comparison function');
			return [];
		}
	    var intersect = [];
	    var a = this.length < array.length ? this : array;
	    var b = this.length < array.length ? array : this;
	    for (var i = 0; i < a.length; ++i) {
	        for (var j = 0; j < b.length; ++j) {
	            if (compare(a[i], b[j]) == true) {
	                intersect.push(a[i]);
	            }
	        }
	    }
	    return intersect;
	};

	/**
	 * @description Get the HTML5 canvas-relative xy-coordinates
	 *   of a mouse. This function assumes there is an mouse-X event
	 *   object to be provided. If not, fake it..
	 * @param {Canvas Object} c: The canvas in which the mouse is acting.
	 * @param {DOM Event} e: The event object created by the mouse action.
	 * @param {Boolean} normalize: Whether or not to convert the coordinates
	 *   into canvas tile size-relative coordinates.
	 * @returns {Object} Integer pair (x,y).
	*/
	window.getCanvasMousePosition = function (c, e, normalize) {
		var b = c.getBoundingClientRect(); // canvas bounds
		var tilew = Math.floor(c.width/settings.environment.width);
		var tileh = Math.floor(c.width/settings.environment.height);
		var pos = {
			x: Math.round((e.clientX-b.left)/(b.right-b.left)*c.width),
			y: Math.round((e.clientY-b.top)/(b.bottom-b.top)*c.height)
		};

		if (!normalize) return pos;
		else return {
			x: Math.floor(pos.x / tilew),
			y: Math.floor(pos.y / tileh)
		};
	};

})();