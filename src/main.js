// This is a prototype of the algorithms used in simulating bacteria
// evolution. See python scripts in the "src" directory for final project.
(function () {
	'use strict';

	var Simulation = function () {
		var that = this;
		this.PAUSED = false;
		this.BEGUN = false;
		this.founders = {
			food: [],
			bacteria: [],
			antibiotic: []
		};

		// Globals
		window.environment = new Environment();
		window.generation = 0; // current generation (global)

		canvas.on('click', function (e) {
			that.canvasClickHandler(e);
		});

		canvas.render();
		this.report();
	};

	Simulation.prototype.start = function () {
		// Start button is also the reset button
		if (this.BEGUN === false) {
			this.PAUSED = false;
			this.BEGUN = true;
			this.loop(100);
		} else {
			this.PAUSED = true;
			this.BEGUN = false;
			this.reset();
		}
		flipStartButton(this.BEGUN);
	};

	Simulation.prototype.stop = function () {
		this.PAUSED = true;
	};

	Simulation.prototype.step = function () {
		this.PAUSED = false;
		this.BEGUN = true;
		this.loop(100);
		this.PAUSED = true;
		flipStartButton(this.BEGUN);
	};

	Simulation.prototype.reset = function () {

		// Delete the current environment and reset to defaults
		window.generation = 0;
		delete window.environment;
		window.environment = new Environment();

		// Add the copies back into the environment.
		// Create copies to avoid modification.
		this.founders.food.forEach(function (f) {
			environment.add(new Food(f.x, f.y));
		});
		this.founders.bacteria.forEach(function (b) {
			environment.add(new Bacteria(b.x, b.y));
		});
		this.founders.antibiotic.forEach(function (a) {
			environment.add(new Antibiotic(a.x, a.y));
		});

		// Re-render
		this.report();
		canvas.render();
		generationTick();
	};

	Simulation.prototype.report = function () {
		console.log('\n\nGeneration ' + generation + '\n');
		console.log('Bacteria count: ' + environment.bacteriaCount);
		console.log('Antibiotic count: ' + environment.antibioticCount);
		console.log('Food count: ' + environment.foodCount);
	};

	Simulation.prototype.canvasClickHandler = function (e) {
		var pos = getCanvasMousePosition(canvas.canvas, e, true);

		if (settings.simulation.spawnbrush == 'bacteria') {
			environment.add(new Bacteria(pos.x, pos.y));
			if (this.BEGUN === false) {
				this.founders.bacteria.push(new Bacteria(pos.x, pos.y));
			}
		}
		else if (settings.simulation.spawnbrush == 'antibiotic') {
			environment.add(new Antibiotic(pos.x, pos.y));
			if (this.BEGUN === false) {
				this.founders.antibiotic.push(new Antibiotic(pos.x, pos.y));
			}
		}
		else {
			environment.add(new Food(pos.x, pos.y));
			if (this.BEGUN === false) {
				this.founders.food.push(new Food(pos.x, pos.y));
			}
		}
		canvas.render();
	};

	Simulation.prototype.checkSuccess = function () {
		return environment.antibioticCount == 0
			&& generation > settings.antibiotic.genx;
	};

	Simulation.prototype.checkFailure = function () {
		return environment.bacteriaCount == 0;
	};

	Simulation.prototype.loop = function (speed) {

		if (this.PAUSED === false) {
			this.update();
		} else {
			return;
		}

		// A: Have the cells overcome the antibiotic?
		if (this.checkSuccess() === true) {
			antibioticDefeated();
			console.log('\nBacteria are immune after ' + generation + ' generations.');
		}

		// B: Have the cells all died?
		else if (this.checkFailure() === true) {
			bacteriaDefeated();
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

		// Next generation
		generation += 1;
		generationTick();

		environment.updateAntibiotic();
		environment.updateBacteria();
		environment.updateFood();

		this.report();
		canvas.render();
	};

	window.sim = new Simulation();
})();