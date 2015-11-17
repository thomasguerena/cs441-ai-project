// This is a prototype of the algorithms used in simulating bacteria
// evolution. See python scripts in the "src" directory for final project.
(function () {
	'use strict';

	var Simulation = function () {
		var that = this;
		this.PAUSED = false;
		window.environment = new Environment(16, 16);

		window.generation = 0; // current generation (global)

		canvas.on('click', function (e) {
			that.canvasClickHandler(e);
		});

		canvas.render();
		this.report();
	};

	/*-- Simulation Rendering --*/

	Simulation.prototype.start = function () {
		this.PAUSED = false;
		this.loop(100);
	};

	Simulation.prototype.stop = function () {
		this.PAUSED = true;
	};

	Simulation.prototype.report = function () {
		console.log('\n\nGeneration ' + generation + '\n');
		console.log('Bacteria count: ' + environment.bacteriaCount);
		console.log('Antibiotic count: ' + environment.antibioticCount);
	};

	Simulation.prototype.canvasClickHandler = function (e) {
		var pos = getCanvasMousePosition(canvas.canvas, e, true);
		if (settings.simulation.spawnbrush == 'bacteria') {
			environment.add(new Bacteria(pos.x, pos.y));
		}
		else if (settings.simulation.spawnbrush == 'antibiotic') {
			environment.add(new Antibiotic(pos.x, pos.y));
		}
		else {
			environment.add(new Food(pos.x, pos.y));
		}
		canvas.render();
	};

	Simulation.prototype.checkSuccess = function () {
		return environment.antibioticCount == 0;
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

		// Next generation
		generation += 1;

		environment.spreadAntibiotic();
		environment.dissolveAntibiotic();
		environment.resolveChallenges();
		environment.updateBacteria();
		environment.updateFood();

		this.report();
		canvas.render();
	};

	window.sim = new Simulation();
})();