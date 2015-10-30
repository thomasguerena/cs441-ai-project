(function () {
	'use strict';

	/*-- Bacteria --*/
	// window.Bacteria = function () {
	// 	this.cells = [];
	// 	this.matrix = new Matrix(16, 16, this.cells);
	// 	this.numCellsAllTime = 0;

	// 	// DEBUGGING - remove
	// 	window.matrix = this.matrix;
	// 	window.cells = this.cells;
	// };

	// Bacteria.prototype.addCell = function (x, y, dna, fitness) {
	// 	var cid = ++this.numCellsAllTime;
	// 	var cx = x || this.matrix.boundX(Math.floor(Math.random()*100)); // TODO
	// 	var cy = y || this.matrix.boundY(Math.floor(Math.random()*100)); // TODO - avoid collisions

	// 	// Duplicate protection
	// 	if (this.matrix.m[cx][cy] === null) {
	// 		this.cells.push(new Cell(cid, cx, cy, dna, fitness));
	// 		this.matrix.addCell(this.cells[this.cells.length - 1]);
	// 	}
	// };

	// Bacteria.prototype.populate = function (n) {
	// 	for (var i = 0; i < n; ++i) {
	// 		this.addCell();
	// 	}
	// };

	// Bacteria.prototype.replicateCell = function (cell) {
	// 	var coords = this.matrix.getEmptyAdjacent(cell);
	// 	if (coords.x < 0 || coords.y < 0) return;
	// 	this.addCell(coords.x, coords.y, cell.dna, cell.fitness);
	// };

	// Bacteria.prototype.mutate = function () {
	// 	// Anneal number of mutant cells
	// 	var anValue = 10 + Math.floor(generation/10);
	// 	var mutants = Math.floor(Math.random()*(this.cells.length)/anValue);
	// 	for (var i = 0; i < mutants; ++i) {
	// 		var mutant = Math.floor(Math.random()*this.cells.length);
	// 		this.cells[mutant].mutate();
	// 	}
	// };

	// Bacteria.prototype.horizontalGeneTransfer = function (remaining) {
	// 	remaining = remaining || this.cells.slice(); // create copy
	// 	var cell = remaining.shift(); // cannot mate with self
	// 	var neighbors = this.matrix.getAdjacent(cell); // get potential mates
	// 	neighbors = removeCellsFromList(remaining, neighbors); // only unmated cells
	// 	var selected = cell.mate(neighbors, remaining);  // get chosen mate
	// 	selected = selected || { cid: -1 }; // provide dummy cell if no mate was selected
	// 	remaining = removeCellsFromList(selected, remaining); // selected cells can't mate again

	// 	if (remaining.length > 1) {
	// 		this.horizontalGeneTransfer(remaining);
	// 	}
	// };

	// Bacteria.prototype.kill = function (cell) {
	// 	this.matrix.removeCell(cell);
	// 	for (var i = 0; i < this.cells.length; ++i) {
	// 		if (this.cells[i].cid === cell.cid) {
	// 			this.cells.splice(i, 1);
	// 			return;
	// 		}
	// 	}
	// };



	window.Bacteria = function (x, y, dna) {
		this.x = x > -1 ? x : Math.floor(Math.random()*16);
		this.y = y > -1 ? y : Math.floor(Math.random()*16);
		this.dna = dna || (function() {
		    var code = '';
		    while (code.length < 3) {
		        code += Math.floor(Math.random() * 10);
		    }
		    return code;
		})();
	};

	Bacteria.prototype.mutate = function () {
		// TODO - this needs to be subtle
	};

	Bacteria.prototype.mate = function (potentialMates) {
		// if (potentialMates.length === 0) return null;

		// // TODO - add modular method for selecting mate

		// var selected = { fitness: 0 }; // dummy cell
		// var dna1, dna2;
		// for (var i = 0; i < potentialMates.length; ++i) {
		// 	if (potentialMates[i].fitness > selected.fitness) {
		// 		selected = potentialMates[i];
		// 	}
		// }

		// dna1 = this.dna[0] + selected.dna[1] + selected.dna[2];
		// dna2 = selected.dna[0] + this.dna[1] + this.dna[2];
		// this.dna = dna1;
		// selected.dna = dna2;
	};
})();