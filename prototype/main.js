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

		this.bacteria.populate(20);
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
					if (that.bacteria.matrix.m[i][j] !== null) ++count;
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

	Simulation.prototype.checkSuccess = function () {
		var targetDNA = this.antibiotic.center;
		for (var i = 1; i < this.bacteria.cells.length; ++i) {
			var dna = this.bacteria.cells[i].dna;
			if (parseInt(dna, 16) !== targetDNA) {
				return false;
			}
		}
		return true;
	};

	Simulation.prototype.checkFailure = function () {
		return this.bacteria.cells.length === 0;
	};

	Simulation.prototype.loop = function () {

		if (this.PAUSED === false) {
			this.update();
		} else {
			return;
		}

		// A: Have the cells overcome the antibiotic?
		if (this.bacteria.cells.length === 6400
		 && this.checkSuccess() === true) {
			console.log('\nBacteria are immune after ' + generation + ' generations.');
		}

		// B: Have the cells all died?
		else if (this.checkFailure() === true) {
			console.log('\nBacteria are dead after ' + generation + ' generations.');
		}

		// C: Cells are still evolving...
		else {
			setTimeout(function (that) {
				that.loop();
			}, 50, this);
		}
	};

	/*-- Evolution Loop --*/

	Simulation.prototype.update = function () {
		var that = this;
		var killset = []; // cells to kill
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
				killset.push(cell);
			} else {
				cloneset.push(cell);
			}
		});

		// 4. Cell Culling
		killset.forEach(function (cell) {
			that.bacteria.kill(cell);
		});

		// 5. Replicate
		cloneset.forEach(function (cell) {
			that.bacteria.replicateCell(cell);
		});

		this.report();
		this.bacteria.matrix.render();
	};

	Simulation.prototype.changeAntibiotic = function() {
		var colorpicker = document.getElementById('colorpicker');
		var reduced = reduceHex(colorpicker.value);
		colorpicker.value = expandHex(reduced);
		this.antibiotic.set(strToHex(reduced));
	};

	window.sim = new Simulation();
})();