(function () {
	'use strict';

	/*-- Environment --*/

	/* @description Manages all instances of bacteria and antibiotic
	 *   in the simulation environment, analogous to a petri dish.
	*/
	window.Environment = function () {

		// Default dimensions
		this.w = settings.environment.width;
		this.h = settings.environment.height;

		// Fixed-length arrays containing bacteria
		//   antibiotic, and food objects, respectively.
		this.bacteriaList = new Array(this.w*this.h);
		this.antibioticList = new Array(this.w*this.h);
		this.foodList = new Array(this.w*this.h);

		// Integer matrices holding the index at which
		//   the bacteria, antibiotic, or food can be
		//   found in their respective lists.
		this.bacteriaMatrix = [];
		this.antibioticMatrix = [];
		this.foodMatrix = [];

		// Population trackers
		this.bacteriaCount = 0;
		this.antibioticCount = 0;
		this.foodCount = 0;

		// Behavior trackers
		this.antibioticDiffusion = 1; // arbitrary non-zero initial value

		// Construct matrices
		for (var i = 0; i < this.w; ++i) {
			this.bacteriaMatrix.push([]);
			this.antibioticMatrix.push([]);
			this.foodMatrix.push([]);
			for (var j = 0; j < this.h; ++j) {
				// Matrix cell values less than 0 indicate
				//   that the cell is vacant.
				this.bacteriaMatrix[i].push(-1);
				this.antibioticMatrix[i].push(-1);
				this.foodMatrix[i].push(-1);
			}
		}
	};

	/*-- Matrix functions --*/

	Environment.prototype.boundX = function (x) {
		return ((x%this.w)+this.w)%this.w; // allow negative numbers
	};

	Environment.prototype.boundY = function (y) {
		return ((y%this.h)+this.h)%this.h; // allow negative numbers
	};

	// @description Adds either a bacteria, antibiotic or food
	//   into the environment, adding both to the list and matrix.
	Environment.prototype.add = function (toAdd) {
		var type = 'unknown';
		var list = null;
		var matrix = null;
		var x = toAdd.x = this.boundX(toAdd.x);
		var y = toAdd.y = this.boundY(toAdd.y);

		if (toAdd instanceof Bacteria) {
			type = 'bacteria';
			list = this.bacteriaList;
			matrix = this.bacteriaMatrix;
		}
		else if (toAdd instanceof Antibiotic) {
			type = 'antibiotic';
			list = this.antibioticList;
			matrix = this.antibioticMatrix;
		}
		else {
			type = 'food';
			list = this.foodList;
			matrix = this.foodMatrix;
		}

		if (matrix[x][y] < 0 && this.foodMatrix[x][y] < 0) {
			for (var i = 0; i < list.length; ++i) {
				if (list[i] == null) {
					list[i] = toAdd;
					matrix[x][y] = i;
					++this[type + 'Count'];
					return;
				}
			}
			console.error('Cannot add ' + type + ': ' +
				'no list vacancy @ ' + i);
		} else {
			console.error('Cannot add ' + type + ': ' +
				'no matrix vacancy @ ' + x + ',' + y);
		}
	};

	Environment.prototype.remove = function (toRemove) {
		var type = 'unknown';
		var list = null;
		var matrix = null;
		var x = toRemove.x = this.boundX(toRemove.x);
		var y = toRemove.y = this.boundY(toRemove.y);
		var listIndex = -1;

		if (toRemove instanceof Bacteria) {
			type = 'bacteria';
			list = this.bacteriaList;
			matrix = this.bacteriaMatrix;
		}
		else if (toRemove instanceof Antibiotic) {
			type = 'antibiotic';
			list = this.antibioticList;
			matrix = this.antibioticMatrix;
		}
		else {
			type = 'food';
			list = this.foodList;
			matrix = this.foodMatrix;
		}

		listIndex = matrix[x][y];

		if (listIndex >= 0) {
			matrix[x][y] = -1;
			list[listIndex] = null;
			--this[type + 'Count'];
		}
	};

	// @description Return an array of 0 to 8 neighboring bacteria cells.
	Environment.prototype.getAdjacent = function (cell) {
		var neighbors = {
			bacteria: [],
			antibiotic: [],
			food: []
		};
		for (var i = -1; i < 2; ++i) {
			for (var j = -1; j < 2; ++j) {
				if (i != 0 || j != 0) {
					var x = this.boundX(cell.x + i);
					var y = this.boundY(cell.y + j);
					var ai = this.antibioticMatrix[x][y]; // antibioticList index
					var bi = this.bacteriaMatrix[x][y]; // bacteriaList index
					var fi = this.foodMatrix[x][y]; // foodList index
					if (ai >= 0) {
						neighbors.antibiotic.push(this.antibioticList[ai]);
					}
					if (bi >= 0) {
						neighbors.bacteria.push(this.bacteriaList[bi]);
					}
					if (fi >= 0) {
						neighbors.food.push(this.foodList[fi]);
					}
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
			antibiotic: [],
			food: []
		};
		for (var i = -1; i < 2; ++i) {
			for (var j = -1; j < 2; ++j) {
				if (i != 0 || j != 0) {
					var x = this.boundX(cell.x + i);
					var y = this.boundY(cell.y + j);
					var ai = this.antibioticMatrix[x][y]; // antibioticList index
					var bi = this.bacteriaMatrix[x][y]; // bacteriaList index
					var fi = this.foodMatrix[x][y]; // foodList index
					if (ai < 0) {
						emptyNeighbors.antibiotic.push({ x: x, y: y });
					}
					if (bi < 0) {
						emptyNeighbors.bacteria.push({ x: x, y: y });
					}
					if (fi < 0) {
						emptyNeighbors.food.push({ x: x, y: y });
					}
				}
			}
		}
		return emptyNeighbors;
	};


	/*-- Biological Functions --*/

	Environment.prototype.populate = function (bacteriaCount, antibioticCount, dna) {

		var xycoords = []; // array of unique xy-coordinates
		var matchCoordinates = function (a, b) {
			return a.x == b.x && a.y == b.y;
		};

		bacteriaCount = bacteriaCount || 20;
		antibioticCount = antibioticCount || 10;

		while (xycoords.length < antibioticCount + bacteriaCount) {
			xycoords.pushUnique({
				x: Math.floor(Math.random()*this.w),
				y: Math.floor(Math.random()*this.h)
			}, matchCoordinates);
		}

		for (var i = 0; i < bacteriaCount; ++i) {
			this.add(new Bacteria(xycoords[i].x, xycoords[i].y));
		}

		for (var j = i; j-i < antibioticCount; ++j) {
			this.add(new Antibiotic(xycoords[j].x, xycoords[j].y));
		}
	};

	// @description Spreads antiobitic radially, given that the antibiotic has
	//   not reached a minimum density. This is calculated using the number of
	//   additional cells occupied by antibiotic each generation.
	//   See variable: this.antibioticDiffusion
	Environment.prototype.updateAntibiotic = function () {
		var al = this.antibioticList.slice(); // create copy
		var alength = al.length;
		for (var i = 0; i < alength; ++i) {
			if (al[i]) al[i].spread();
		}
		this.resolveChallenges();
	};

	Environment.prototype.updateBacteria = function () {
		var bl = this.bacteriaList.slice(); // create copy
		var blength = bl.length;
		for (var i = 0; i < blength; ++i) {
			if (bl[i]) bl[i].update();
		}
	};

	Environment.prototype.updateFood = function () {

		if (generation % settings.food.regenerationRate == 0) {
			environment.add(new Food());
		}

		var fl = this.foodList.slice(); // create copy
		var flength = fl.length;
		for (var i = 0; i < flength; ++i) {
			if (fl[i]) fl[i].update();
		}
	};

	Environment.prototype.resolveChallenges = function () {
		for (var i = 0; i < this.w; ++i) {
			for (var j = 0; j < this.h; ++j) {
				var ai = this.antibioticMatrix[i][j];
				var bi = this.bacteriaMatrix[i][j];
				if (ai > -1 && bi > -1) {
					if (this.antibioticList[ai].kills(this.bacteriaList[bi])) {
						this.remove(this.bacteriaList[bi]);
					} else {
						this.remove(this.antibioticList[ai]);
					}
				}
			}
		}
	};

})();