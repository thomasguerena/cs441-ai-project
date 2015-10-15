// This is a prototype of the algorithms used in simulating bacteria
// evolution. See python scripts in the "src" directory for final project.
(function () {
	'use strict';

	var Simulation = function () {
		this.PAUSED = false;
		this.bacteria = new Bacteria();
		this.antibiotic = new Antibiotic();
		window.generation = 0; // current generation - global
		this.criticalGeneration = 10; // when to introduct antibiotic

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
		var cellCount = this.bacteria.cells.length
		var matrixCount = (function () {
			var count = 0;
			for (var i = 0; i < that.bacteria.matrix.m.length; ++i) {
				for (var j = 0; j < that.bacteria.matrix.m[i].length; ++j) {
					if (that.bacteria.matrix.m[i][j] !== 0) ++count;
				}
			}
			return count;
		})();
		console.log('\n\nGeneration ' + generation + '\n');
		console.log('Cell count: ' + cellCount);
		console.log('Cells in matrix: ' + matrixCount);
		if (cellCount > matrixCount) {
			console.log('Overlapping cells:');
			for (var i = 0; i < that.bacteria.cells.length; ++i) {
				for (var j = 0; j < that.bacteria.cells.length; ++j) {
					if (that.bacteria.cells[i].x == that.bacteria.cells[j].x
					 && that.bacteria.cells[i].y == that.bacteria.cells[j].y
					 && i !== j) {
						console.log(that.bacteria.cells[i]);
					}
				}
			}
		}
		if (cellCount < matrixCount) {
			console.log('Zombies found in matrix!');
		}
	}

	// @param {number} minGenDuration is the least length of time, in
	// milliseconds, that elaspes per generation.
	Simulation.prototype.loop = function (minGenDuration) {
	 	// TODO - ignore animation speed for now
		if (this.PAUSED === true) return;
		this.update();
		if (this.bacteria.cells.length > 0) {
			setTimeout(function (that) {
				that.loop(minGenDuration);
			}, 50, this);
		}
	};

	/*-- Evolution Loop --*/

	Simulation.prototype.update = function () {
		var that = this;
		var cullset = []; // cells to kill
		var cloneset = []; // cells to clone

		// Next generation
		generation += 1;

		// 1. Cell Mutation (every N generations)
		if (generation%1 === 0) {
			this.bacteria.mutate();
		}

		// 2. Horizontal Gene Transfer
		// this.bacteria.horizontalGeneTransfer();

		// 3. Apply Antibiotic
		this.bacteria.cells.forEach(function (cell) {
			if (generation > that.criticalGeneration) {
				cell.fitness = that.antibiotic.chanceOfSurvival(cell);
			}
			if (cell.survives() === false) {
				cullset.push(cell);
			} else {
				cloneset.push(cell);
			}
		});

		// 4. Cull
		cullset.forEach(function (cell) {
			that.bacteria.kill(cell);
		});

		// 5. Replicate
		cloneset.forEach(function (cell) {
			that.bacteria.replicateCell(cell);
		});

		this.report();
		this.bacteria.matrix.render();
	};

	window.sim = new Simulation();
})();