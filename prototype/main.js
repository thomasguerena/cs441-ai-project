// This is a prototype of the algorithms used in simulating bacteria
// evolution. See python scripts in the "src" directory for final project.
(function () {
	'use strict';

	var Simulation = function () {
		this.PAUSED = false;
		this.environment = new Environment(16, 16);
		this.canvas = document.querySelector('canvas');
		this.ctx = this.canvas.getContext('2d');
		this.ctx.textAlign = 'center';
		this.ctx.font = '18px Helvetica';

		window.generation = 0; // current generation - global

		this.environment.populate(8, 3);
		this.render();
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
		console.log('Bacteria count: ' + this.environment.bacteriaCount);
		console.log('Antibiotic count: ' + this.environment.antibioticCount);
	}

	Simulation.prototype.render = function (withText) {
		var colors = {
			text: '#FFFFFF',
			bacteria: '#CCDC00',
			antibiotic: '#F24405',
			challenge: '#F28705'
		};
		var tilesize = Math.floor(this.canvas.width/this.environment.n);
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		for (var i = 0; i < this.environment.n; ++i) {
			for (var j = 0; j < this.environment.m; ++j) {
				var cx = tilesize*i;
				var cy = tilesize*j;
				var tx = cx + tilesize/2;
				var ty = (cy + tilesize/2) + 5;
				var ai = this.environment.antibioticMatrix[i][j];
				var bi = this.environment.bacteriaMatrix[i][j];
				this.ctx.globalAlpha = 1;

				if (ai >= 0 && bi >= 0) {
				 	var psurvival = 1 - this.environment.antibioticList[ai].potency/100;
				 	this.ctx.fillStyle = colors.challenge;
					this.ctx.fillRect(cx, cy, tilesize, tilesize);
					if (withText) {
						this.ctx.fillStyle = colors.text;
						this.ctx.fillText(psurvival, tx, ty);
					}
				} else if (ai >= 0) {
					var potency = this.environment.antibioticList[ai].potency;
					this.ctx.globalAlpha = potency/100;
					this.ctx.fillStyle = colors.antibiotic;
					this.ctx.fillRect(cx, cy, tilesize, tilesize);
					if (withText) {
						this.ctx.globalAlpha = 1;
						this.ctx.fillStyle = colors.text;
						this.ctx.fillText(potency, tx, ty);
					}
				} else if (bi >= 0) {
					var dna = this.environment.bacteriaList[bi].dna;
					this.ctx.fillStyle = colors.bacteria;
					this.ctx.fillRect(cx, cy, tilesize, tilesize);
					if (withText) {
						this.ctx.fillStyle = colors.text;
						this.ctx.fillText(dna, tx, ty);
					}
				}
			}
		}
	};

	Simulation.prototype.checkSuccess = function () {
		return this.environment.antibioticCount == 0;
	};

	Simulation.prototype.checkFailure = function () {
		return this.environment.bacteriaCount == 0;
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

		this.environment.spreadAntibiotic();
		this.environment.dissolveAntibiotic();
		this.environment.resolveChallenges();
		this.environment.updateBacteria();

		this.report();
		this.render(false);
	};

	window.sim = new Simulation();
})();