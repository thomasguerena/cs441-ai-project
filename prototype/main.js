// This is a prototype of the algorithms used in simulating bacteria
// evolution. See python scripts in the "src" directory for final project.
(function () {
	'use strict';

	var Simulation = function () {
		this.PAUSED = false;
		this.environment = new Environment(16, 16);
		this.canvas = document.querySelector('canvas');
		this.ctx = this.canvas.getContext('2d');

		window.generation = 0; // current generation - global
		this.criticalGeneration = 10; // when to introduce antibiotic

		this.environment.populate();
		this.render();
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
		console.log('\n\nGeneration ' + generation + '\n');
		console.log('Bacteria count: ' + this.environment.bacteriaCount);
		console.log('Antibiotic count: ' + this.environment.antibioticCount);
	}

	Simulation.prototype.render = function () {
		var tilesize = Math.floor(this.canvas.width/this.environment.n);
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		for (var i = 0; i < this.environment.n; ++i) {
			for (var j = 0; j < this.environment.m; ++j) {
				var cx = tilesize*i;
				var cy = tilesize*j;
				if (this.environment.bacteriaMatrix[i][j] >= 0
				 && this.environment.antibioticMatrix[i][j] >= 0) {
				 	this.ctx.fillStyle = '#F28705';
					this.ctx.fillRect(cx, cy, tilesize, tilesize);
				} else if (this.environment.bacteriaMatrix[i][j] >= 0) {
					this.ctx.fillStyle = '#CCDC00';
					this.ctx.fillRect(cx, cy, tilesize, tilesize);
				} else if (this.environment.antibioticMatrix[i][j] >= 0) {
					this.ctx.fillStyle = '#F24405';
					this.ctx.fillRect(cx, cy, tilesize, tilesize);
				}
			}
		}
	};

	Simulation.prototype.checkSuccess = function () {
		return this.environment.antibioticList.length == 0;
	};

	Simulation.prototype.checkFailure = function () {
		return this.environment.bacteriaList.length == 0;
	};

	Simulation.prototype.loop = function (speed) {

		if (this.PAUSED === false) {
			this.update();
		} else {
			return;
		}

		// A: Have the cells overcome the antibiotic?
		if (this.checkSuccess() === true) {
			console.log('\nBacteria are immune after ' + generation + ' generations.');
		}

		// B: Have the cells all died?
		else if (this.checkFailure() === true) {
			console.log('\nBacteria are dead after ' + generation + ' generations.');
		}

		// C: Cells are still evolving...
		else {
			setTimeout(function (that) {
				that.loop(speed);
			}, speed, this);
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
			// this.bacteria.mutate();
		}

		// 2. Horizontal Gene Transfer
		// this.bacteria.horizontalGeneTransfer();

		// 3. Apply Antibiotic

		// this.bacteria.cells.forEach(function (cell) {
		// 	if (generation > that.criticalGeneration) {
		// 		cell.fitness = that.antibiotic.chanceOfSurvival(cell);
		// 	}
		// 	if (cell.survives() === false) {
		// 		killset.push(cell);
		// 	} else {
		// 		cloneset.push(cell);
		// 	}
		// });

		// 4. Cell Culling

		// killset.forEach(function (cell) {
		// 	that.bacteria.kill(cell);
		// });

		// 5. Replicate

		// cloneset.forEach(function (cell) {
		// 	that.bacteria.replicateCell(cell);
		// });

		this.report();
		this.render();
	};

	Simulation.prototype.changeAntibiotic = function() {
		var colorpicker = document.getElementById('colorpicker');
		var reduced = reduceHex(colorpicker.value);
		colorpicker.value = expandHex(reduced);
		this.antibiotic.set(strToHex(reduced));
	};

	window.sim = new Simulation();
})();