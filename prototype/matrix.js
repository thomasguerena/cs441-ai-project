(function () {
	'use strict';

	/*-- Matrix --*/

	// @description Creates an N by M matrix of bacteria cells.
	window.Matrix = function (n, m, cells) {
		var that = this;
		this.canvas = document.querySelector('canvas');
		this.ctx = this.canvas.getContext('2d');
		this.cells = cells; // shared with Bacteria class
		this.m = [];
		for (var i = 0; i < n; ++i) {
			this.m.push([]);
			for (var j = 0; j < m; ++j) {
				this.m[i].push(null);
			}
		}
	};

	Matrix.prototype.boundX = function (x) {
		return ((x%this.m.length)+this.m.length)%this.m.length;
	};

	Matrix.prototype.boundY = function (y) {
		return ((y%this.m[0].length)+this.m[0].length)%this.m[0].length;
	};

	Matrix.prototype.addCell = function (cell) {
		if (!this.m[cell.x][cell.y]) {
			this.m[cell.x][cell.y] = cell;
		}
	};

	Matrix.prototype.removeCell = function (cell) {
		this.m[cell.x][cell.y] = null;
	};

	// @description Return an array of 0 to 8 neighboring bacteria cells.
	Matrix.prototype.getAdjacent = function (cell) {
		var neighbors = [];
		for (var i = -1; i < 2; ++i) {
			for (var j = -1; j < 2; ++j) {
				var x = this.boundX(cell.x + i);
				var y = this.boundY(cell.y + j);
				if (i !== 0 && j !== 0 && this.m[x][y] !== null) {
					neighbors.push(this.m[x][y]);
				}
			}
		}
		return neighbors;
	};

	// @description Return the coordinates of an empty adjacent
	//   matrix cell. If one does not exist, the coords will be (-1, -1).
	//   This MUST be done in a random order.
	Matrix.prototype.getEmptyAdjacent = function (cell) {
		var x = cell.x; // x-coord
		var y = cell.y; // y-coord
		var l1 = this.m.length; // x axis length
		var l2 = this.m[0].length; // y axis length
		var a = knuthShuffle([0,1,2,3,4,5,6,7]); // action list
		while (a.length > 0) {
			var c = a.shift(); // current action
			var ax, ay; // "actioned" xy-coordinates
			switch (c) {
				case 0: ax = x; ay = y+1; break;
				case 1: ax = x; ay = y-1; break;
				case 2: ax = x+1; ay = y; break;
				case 3: ax = x-1; ay = y; break;
				case 4: ax = x+1; ay = y+1; break;
				case 5: ax = x+1; ay = y-1; break;
				case 6: ax = x-1; ay = y+1; break;
				case 7: ax = x-1; ay = y-1; break;
			}

			ax = ((ax%l1)+l1)%l1; // This provides a true modulus,
			ay = ((ay%l2)+l2)%l2; // ..which handles negative values.
			if (this.m[ax][ay] === null) return { x: ax, y: ay };
		}
		return { x: -1, y: -1};
	}

	Matrix.prototype.render = function () {
		var that = this;
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.cells.forEach(function (cell) {
			var cx = 10*cell.x;
			var cy = 10*cell.y;
			that.ctx.fillStyle = '#' + cell.dna;
			if (cx <= that.ctx.canvas.clientWidth && cy <= that.ctx.canvas.clientHeight) {
				that.ctx.fillRect(cx, cy, 10, 10);
			}
		});
	};
})();