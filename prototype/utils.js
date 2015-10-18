(function () {
	'use strict';

	// Valid hex digits
	window.hexc = '0123456789abcdef';

	// Convert hex number to hex string
	window.hexToStr = function (num) {
		return num.toString(16);
	};

	// Convert hex string to hex number
	window.strToHex = function (str) {
		return parseInt(str, 16);
	};

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

	// Reduce hex color string from 6-digit to 3
	window.reduceHex = function (str) {
		str = str[0] == '#' ? str.slice(1, str.length) : str;
		return str[0] + str[2] + str[4];
	};

	// Expand hex color string from 3-digit to 6
	window.expandHex = function (str) {
		var result = '#';
		str = str[0] == '#' ? str.slice(1, str.length) : str;
		for (var i = 0; i < str.length; ++i) {
			result += str[i] + str[i];
		}
		return result;
	};
})();