(function () {
	'use strict';

	/*-- Environment --*/

	/* @description Manages all instances of bacteria and antibiotic
	 *   in the simulation environment, analogous to a petri dish.
	 * @param {integer} n Width of the environment matrix.
	 * @param {integer} n Height of the environment matrix.
	*/
	window.Environment = function (n, m) {

		// Default dimensions
		this.n = n || 16;
		this.m = m || 16;

		// Fixed-length arrays containing bacteria
		//   and antibiotic objects, respectively.
		this.bacteriaList = [];
		this.antibioticList = [];

		// Integer matrices holding the index at which
		//   the bacteria or antibiotic can be found in
		//   their respective lists.
		this.bacteriaMatrix = [];
		this.antibioticMatrix = [];

		// Construct matrices
		for (var i = 0; i < n; ++i) {
			this.bacteriaMatrix.push([]);
			this.antibioticMatrix.push([]);
			for (var j = 0; j < m; ++j) {
				// Matrix cell values less than 0 indicate
				//   that the cell is vacant.
				this.bacteriaMatrix.push(-1);
				this.antibioticMatrix.push(-1);
			}
		}
	};

	/*-- Matrix functions --*/

	Environment.prototype.boundX = function (x) {
		return ((x%this.n)+this.n)%this.n; // allow negative numbers
	};

	Environment.prototype.boundY = function (y) {
		return ((y%this.m)+this.m)%this.m; // allow negative numbers
	};

	// @description Adds either a bacteria or antibiotic
	//   into the environment, adding both to the list and
	//   matrix.
	Environment.prototype.add = function (toAdd) {
		var type = toAdd instanceof Bacteria ? 0 : 1;
		var typeStr = type == 0 ? 'bacteria' : 'antibiotic';
		var list = type ? this.bacteriaList : this.antibioticList;
		var matrix = type ? this.bacteriaMatrix : this.antibioticMatrix;
		var x = this.boundX(toAdd.x);
		var y = this.boundY(toAdd.y);

		console.log(matrix); //rmv
		console.log(matrix[x][y]); //rmv

		if (matrix[x][y] < 0) {
			for (var i = 0; i < list.length; ++i) {
				if (list[i] == null) {
					list[i] = toAdd;
					matrix[x][y] = i;
					return;
				}
			}
			console.error('Cannot add ' + typeStr + ': ' +
				'no list vacancy @' + i);
		} else {
			console.error('Cannot add ' + typeStr + ': ' +
				'no matrix vacancy @' + x + ',' + y);
		}
	};

	Environment.prototype.remove = function (toRemove) {
		var type = toRemove instanceof Bacteria ? 0 : 1;
		var typeStr = type ? 'bacteria' : 'antibiotic';
		var list = type ? this.bacteriaList : this.antibioticList;
		var matrix = type ? this.bacteriaMatrix : this.antibioticMatrix;
		var x = this.boundX(toRemove.x);
		var y = this.boundY(toRemove.y);
		var listIndex = matrix[x][y];

		if (listIndex >= 0) {
			matrix[x][y] = -1;
			list[listIndex] = null;
		} else {
			console.error('Cannot remove ' + typeStr + ': ' +
				'no occupied cell @' + listIndex +
				' (' + x + ',' + y + ')');
		}
	};

	Environment.prototype.populate = function (bacteriaCount, antibioticCount, dna) {
		bacteriaCount = bacteriaCount || 20;
		antibioticCount = antibioticCount || 10;

		for (var i = 0; i < bacteriaCount; ++i) {
			this.add(new Bacteria(
				//
			));
		}

		for (var i = 0; i < antibioticCount; ++i) {
			//
		}
	};

	// @description Return an array of 0 to 8 neighboring bacteria cells.
	Environment.prototype.getAdjacent = function (cell) {
		var neighbors = {
			bacteria: [],
			antibiotic: []
		};
		for (var i = -1; i < 2; ++i) {
			for (var j = -1; j < 2; ++j) {
				var x = this.boundX(cell.x + i);
				var y = this.boundY(cell.y + j);
				var ali = this.bacteriaMatrix[x][y]; // antibioticList index
				var bli = this.bacteriaMatrix[x][y]; // bacteriaList index
				if (ali >= 0) {
					neighbors.antibiotic.push(this.antibioticList[ali]);
				}
				if (bli >= 0) {
					neighbors.bacteria.push(this.bacteriaList[ali]);
				}
			}
		}
		return neighbors;
	};

	// @description Return the coordinates of an empty adjacent
	//   Environment cell. If one does not exist, the coords will be (-1, -1).
	//   This MUST be done in a random order.
	Environment.prototype.getEmptyAdjacent = function (cell) {
		var emptyNeighbors = {
			bacteria: [],
			antibiotic: []
		};
		for (var i = -1; i < 2; ++i) {
			for (var j = -1; j < 2; ++j) {
				var x = this.boundX(cell.x + i);
				var y = this.boundY(cell.y + j);
				var ali = this.bacteriaMatrix[x][y]; // antibioticList index
				var bli = this.bacteriaMatrix[x][y]; // bacteriaList index
				if (ali < 0) {
					emptyNeighbors.antibiotic.push({ x: x, y: y });
				}
				if (bli >= 0) {
					emptyNeighbors.bacteria.push({ x: x, y: y });
				}
			}
		}
		return emptyNeighbors;
	}

})();