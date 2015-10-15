// This is a prototype of the algorithms used in simulating bacteria
// evolution. See python scripts in the "src" directory for final project.
(function () {
	'use strict';

	var Simulation = function () {
		this.PAUSED = false;
		this.bacteria = new Bacteria();
		this.antibiotic = new Antibiotic();
		this.generation = 0;
		this.maxGeneration = Infinity;

		this.bacteria.populate();
		this.bacteria.matrix.render();
		this.report();
	};

	/*-- Simulation Rendering --*/

	Simulation.prototype.start = function () {
		this.PAUSED = false;
		this.loop(500);
	};

	Simulation.prototype.stop = function () {
		this.PAUSED = true;
	};

	Simulation.prototype.report = function () {
		var that = this;
		console.log('\n\nGeneration ' + this.generation + '\n'); //rmv
		console.log('Cell count: ' + this.bacteria.cells.length); //rmv
		console.log('Cells in matrix: ' + (function () {
			var count = 0;
			for (var i = 0; i < that.bacteria.matrix.m.length; ++i) {
				for (var j = 0; j < that.bacteria.matrix.m[i].length; ++j) {
					if (that.bacteria.matrix.m[i][j] !== 0) ++count;
				}
			}
			return count;
		})());
	}

	// @param {number} minGenDuration is the least length of time, in
	// milliseconds, that elaspes per generation.
	Simulation.prototype.loop = function (minGenDuration) {
	 	// TODO - ignore animation speed for now
		if (this.PAUSED === true) return;
		this.update();
		if (this.generation < this.maxGeneration
		 && this.bacteria.cells.length > 0) {
			setTimeout(function (that) {
				that.loop(minGenDuration);
			}, 50, this);
		}
	};

	/*-- Evolution Loop --*/

	Simulation.prototype.update = function () {
		var that = this;

		// Next generation
		this.generation += 1;

		// 1. Cell Mutation (every N generations)
		if (this.generation%100 === 0) {
			this.bacteria.cells.forEach(function (cell) {
				cell.mutate();
			});
		}

		// 2. Horizontal Gene Transfer
		// this.bacteria.horizontalGeneTransfer();

		// 3. Apply Antibiotic and Cull
		this.bacteria.cells.forEach(function (cell) {
			var p = that.antibiotic.chanceOfSurvival(cell);
			if (cell.survives(p) === false) {
				that.bacteria.kill(cell);
			} else {
				// 4. Replicate
				that.bacteria.replicateCell(cell);
			}
		});

		// TEMPORARY
		this.bacteria.cells.forEach(function (cell) {
			that.bacteria.replicateCell(cell);
		});

		// this.report();
		this.bacteria.matrix.render();
	};

	window.sim = new Simulation();
})();