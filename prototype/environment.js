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
		this.bacteriaList = new Array(n*m);
		this.antibioticList = new Array(n*m);

		// Integer matrices holding the index at which
		//   the bacteria or antibiotic can be found in
		//   their respective lists.
		this.bacteriaMatrix = [];
		this.antibioticMatrix = [];

		// Population trackers
		this.bacteriaCount = 0;
		this.antibioticCount = 0;

		// Behavior trackers
		this.antibioticDiffusion = 1; // arbitrary non-zero initial value

		// Construct matrices
		for (var i = 0; i < n; ++i) {
			this.bacteriaMatrix.push([]);
			this.antibioticMatrix.push([]);
			for (var j = 0; j < m; ++j) {
				// Matrix cell values less than 0 indicate
				//   that the cell is vacant.
				this.bacteriaMatrix[i].push(-1);
				this.antibioticMatrix[i].push(-1);
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
		var typeStr = !type ? 'bacteria' : 'antibiotic';
		var list = !type ? this.bacteriaList : this.antibioticList;
		var matrix = !type ? this.bacteriaMatrix : this.antibioticMatrix;
		var x = toAdd.x = this.boundX(toAdd.x);
		var y = toAdd.y = this.boundY(toAdd.y);

		if (matrix[x][y] < 0) {
			for (var i = 0; i < list.length; ++i) {
				if (list[i] == null) {
					list[i] = toAdd;
					matrix[x][y] = i;
					++this[typeStr + 'Count'];
					return;
				}
			}
			console.error('Cannot add ' + typeStr + ': ' +
				'no list vacancy @ ' + i);
		} else {
			console.error('Cannot add ' + typeStr + ': ' +
				'no matrix vacancy @ ' + x + ',' + y);
		}
	};

	Environment.prototype.remove = function (toRemove) {
		var type = toRemove instanceof Bacteria ? 0 : 1;
		var typeStr = !type ? 'bacteria' : 'antibiotic';
		var list = !type ? this.bacteriaList : this.antibioticList;
		var matrix = !type ? this.bacteriaMatrix : this.antibioticMatrix;
		var x = this.boundX(toRemove.x);
		var y = this.boundY(toRemove.y);
		var listIndex = matrix[x][y];

		if (listIndex >= 0) {
			matrix[x][y] = -1;
			list[listIndex] = null;
			--this[typeStr + 'Count'];
		}
		// else {
		// 	console.error('Cannot remove ' + typeStr + ': ' +
		// 		'no occupied cell @ ' + listIndex +
		// 		' (' + x + ',' + y + ')');
		// }
	};

	// @description Return an array of 0 to 8 neighboring bacteria cells.
	Environment.prototype.getAdjacent = function (cell) {
		var neighbors = {
			bacteria: [],
			antibiotic: []
		};
		for (var i = -1; i < 2; ++i) {
			for (var j = -1; j < 2; ++j) {
				if (i != 0 || j != 0) {
					var x = this.boundX(cell.x + i);
					var y = this.boundY(cell.y + j);
					var ai = this.antibioticMatrix[x][y]; // antibioticList index
					var bi = this.bacteriaMatrix[x][y]; // bacteriaList index
					if (ai >= 0) {
						neighbors.antibiotic.push(this.antibioticList[ai]);
					}
					if (bi >= 0) {
						neighbors.bacteria.push(this.bacteriaList[bi]);
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
			antibiotic: []
		};
		for (var i = -1; i < 2; ++i) {
			for (var j = -1; j < 2; ++j) {
				if (i != 0 || j != 0) {
					var x = this.boundX(cell.x + i);
					var y = this.boundY(cell.y + j);
					var ai = this.antibioticMatrix[x][y]; // antibioticList index
					var bi = this.bacteriaMatrix[x][y]; // bacteriaList index
					if (ai < 0) {
						emptyNeighbors.antibiotic.push({ x: x, y: y });
					}
					if (bi < 0) {
						emptyNeighbors.bacteria.push({ x: x, y: y });
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
				x: Math.floor(Math.random()*this.n),
				y: Math.floor(Math.random()*this.m)
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
	Environment.prototype.spreadAntibiotic = function () {
		if (this.antibioticDiffusion == 0) return; // reached minimum density
		if (generation % 5 !== 0) return; // throttle the rate of diffusion

		var spreading = this.antibioticList.slice(); // create copy
		var numSpread = 0;
		for (var i = 0; i < spreading.length; ++i) {
			if (spreading[i] && spreading[i].diffused == false) {
				var emptyAdj = this.getEmptyAdjacent(spreading[i]).antibiotic;
				for (var j = 0; j < emptyAdj.length; ++j) {
					var p = Math.max(spreading[i].potency - 20, 0);
					if (p > 0) {
						spreading[i].diffused = true;
						this.add(new Antibiotic(
							emptyAdj[j].x,
							emptyAdj[j].y,
							p
						));
						++numSpread;
					}
				}
			}
		}
		this.antibioticDiffusion = numSpread;
	};

	Environment.prototype.updateBacteria = function () {

		this.moveBacteria();

		if (generation%50 === 0) {
			this.mutateBacteria();
		}

		if (generation%3 === 0) {
			this.replicateBacteria();
		}

		// TODO

		// if (generation%5 === 0) {
		// 	this.mateBacteria();
		// }
	};

	Environment.prototype.moveBacteria = function () {
		var bl = this.bacteriaList.slice(); // create copy
		for (var i = 0; i < bl.length; ++i) {
			if (bl[i] != null) {
				var move = Number(bl[i].dna[0]);
				var decision = 0;
				var emptyAdj = this.getEmptyAdjacent(bl[i]).bacteria;
				var adjAntibiotic = this.getAdjacent(bl[i]).antibiotic;
				var availableIndex = move % emptyAdj.length;

				if (emptyAdj.length == 0) return;
				availableIndex = (availableIndex + adjAntibiotic.length) % emptyAdj.length;
				decision = emptyAdj[availableIndex];
				this.remove(bl[i]);
				bl[i].x = decision.x;
				bl[i].y = decision.y;
				this.add(bl[i]);
			}
		}
	};

	Environment.prototype.mutateBacteria = function () {
		for (var i = 0; i < this.bacteriaList.length; ++i) {
			if (this.bacteriaList[i] != null) {
				this.bacteriaList[i].mutate();
			}
		}
	};

	Environment.prototype.replicateBacteria = function () {
		var bl = this.bacteriaList.slice(); // create copy
		for (var i = 0; i < bl.length; ++i) {
			if (bl[i] != null) {
				var replicate = Number(bl[i].dna[1]);
				var decision = 0;
				var emptyAdj = this.getEmptyAdjacent(bl[i]).bacteria;
				var adjAntibiotic = this.getAdjacent(bl[i]).antibiotic;
				var availableIndex = replicate % emptyAdj.length;
				availableIndex = (availableIndex + adjAntibiotic.length) % emptyAdj.length;
				decision = emptyAdj[availableIndex];

				if (emptyAdj.length == 0) return;
				if (bl[i].x != decision.x && bl[i].y != decision.y) {
					bl[i].x = decision.x;
					bl[i].y = decision.y;
					this.add(new Bacteria(bl[i].x, bl[i].y, bl[i].dna));
				}
			}
		}
	};

	Environment.prototype.resolveChallenges = function () {
		for (var i = 0; i < this.n; ++i) {
			for (var j = 0; j < this.m; ++j) {
				var ai = this.antibioticMatrix[i][j];
				var bi = this.bacteriaMatrix[i][j];
				if (ai > -1 && bi > -1) {
					if (this.antibioticList[ai].kill()) {
						this.remove(this.bacteriaList[bi]);
					} else {
						this.remove(this.antibioticList[ai]);
					}
				}
			}
		}
	};

})();