(function () {
	'use strict';

	/*-- Bacteria --*/
	window.Bacteria = function () {
		this.cells = [];
		this.matrix = new Matrix(80, 80, this.cells);
		this.numCellsAllTime = 0;

		// DEBUGGING - remove
		window.matrix = this.matrix;
		window.cells = this.cells;
	};

	Bacteria.prototype.addCell = function (x, y, dna) {
		var cid = ++this.numCellsAllTime;
		var cx = x || Math.floor(Math.random()*20); // TODO
		var cy = y || Math.floor(Math.random()*20); // TODO - avoid collisions

		this.cells.push(new Cell(cid, cx, cy, dna));
		this.matrix.addCell(this.cells[this.cells.length - 1]);
	};

	Bacteria.prototype.populate = function () {
		for (var i = 0; i < 5; ++i) {
			this.addCell();
		}
	};

	Bacteria.prototype.replicateCell = function (cell) {
		var coords = this.matrix.getEmptyAdjacent(cell);
		if (coords.x < 0 || coords.y < 0) return;
		this.addCell(coords.x, coords.y, cell.dna);
	};

	Bacteria.prototype.horizontalGeneTransfer = function () {
		var remaining = this.cells.slice(); // create copy
		var pairs = [];

		// Pair up adjacent cells.
		while (remaining.length > 1) {
			var cell = remaining.shift();
			var adj = this.matrix.getAdjacent(cell);
			// Intersect adjacent and remaining cells.
			adj = adj.filter(function (c1) {
				for (var c2 in remaining) {
					if (c1.cid === c2.cid) {
						return true;
					}
				}
				return false;
			});
			if (adj.length > 0) {
				pairs.push([cell, adj.shift()]);
			}
		}

		// Swap some of their DNA.
		// TODO
		console.log(pairs);
	};

	Bacteria.prototype.kill = function (cell) {
		this.matrix.removeCell(cell);
		for (var i = 0; i < this.cells.length; ++i) {
			if (this.cells[i].cid === cell.cid) {
				this.cells.splice(i, 1);
			}
		}
	};


	/*-- Cell --*/
	var Cell = function (cid, x, y, dna) {
		this.cid = cid;
		this.x = x || 0;
		this.y = y || 0;
		this.dna = dna || (function() {
			var code = '';
			while (code.length < 3) {
				code += hexc.charAt(Math.floor(Math.random() * hexc.length));
			}
			return code;
		})();
	};

	Cell.prototype.mutate = function () {
		// Each gene has a 40% chance to mutate.
		var chanceToMutate = 0.4;
		for (var i = 0; i < this.dna.length; ++i) {
			if (Math.random() <= chanceToMutate) {
				this.shiftGene(i);
			}
		}
	};

	Cell.prototype.shiftGene = function (index) {
		// TODO - make this a random value that anneals
		var variance = 3; // co-prime to 16
		var c = hexToStr((strToHex(this.dna.charAt(index)) + variance)%16);
		this.dna = this.dna.substr(0, index) + c + this.dna.substr(index + 1);
	};

	Cell.prototype.survives = function (probability) {
		return Math.random() <= probability;
	};
})();