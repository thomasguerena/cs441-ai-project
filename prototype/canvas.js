(function () {
	'use strict';

	var Canvas = function (canvas) {
		var that = this;
		this.canvas = canvas;
		this.ctx = this.canvas.getContext('2d');
		this.ctx.textAlign = 'center';
		this.ctx.font = '18px Helvetica';
		this.tilesize = Math.floor(this.canvas.width/settings.environment.n);
		this.colors = {
			text: '#FFFFFF',
			food: '#CD89D8',
			bacteria: '#CCDC00',
			antibiotic: '#F24405',
			challenge: '#F28705'
		};

		// Indicate the current "highlighted" tile
		this.on('mousemove', function (e) { that.onHover(e); });
		this.on('mouseout', function (e) { that.render(); });
	};

	// More attractive event handlers binding
	Canvas.prototype.on = function (eventName, handler) {
		this.canvas.addEventListener(eventName, handler);
	};

	/**
	 * @description Render the entire simulation scene.
	 * @param {Environment} environment
	 * @param {Boolean} DEBUGGING - Should debugging text be rendered?
	*/
	Canvas.prototype.render = function(DEBUGGING) {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		for (var i = 0; i < environment.n; ++i) {
			for (var j = 0; j < environment.m; ++j) {
				var cx = this.tilesize*i;
				var cy = this.tilesize*j;
				var tx = cx + this.tilesize/2;
				var ty = (cy + this.tilesize/2) + 5;
				var ai = environment.antibioticMatrix[i][j];
				var bi = environment.bacteriaMatrix[i][j];
				var fi = environment.foodMatrix[i][j];
				this.ctx.globalAlpha = 1;

				// TODO Change PROB(survival) calculations

				// TODO - isn't there a better way of doing this? Do we care?

				if (ai >= 0 && bi >= 0) {
				 	var psurvival = 1 - environment.antibioticList[ai].potency/100;
				 	this.ctx.fillStyle = this.colors.challenge;
					this.ctx.fillRect(cx, cy, this.tilesize, this.tilesize);
					if (DEBUGGING) {
						this.ctx.fillStyle = this.colors.text;
						this.ctx.fillText(psurvival, tx, ty);
					}
				} else if (ai >= 0) {
					var potency = environment.antibioticList[ai].potency;
					this.ctx.globalAlpha = potency/100;
					this.ctx.fillStyle = this.colors.antibiotic;
					this.ctx.fillRect(cx, cy, this.tilesize, this.tilesize);
					if (DEBUGGING) {
						this.ctx.globalAlpha = 1;
						this.ctx.fillStyle = this.colors.text;
						this.ctx.fillText(potency, tx, ty);
					}
				} else if (bi >= 0) {
					var dna = environment.bacteriaList[bi].dna;
					this.ctx.fillStyle = this.colors.bacteria;
					this.ctx.fillRect(cx, cy, this.tilesize, this.tilesize);
					if (DEBUGGING) {
						this.ctx.fillStyle = this.colors.text;
						this.ctx.fillText(dna, tx, ty);
					}
				} else if (fi >= 0) {
					var sustenance = environment.foodList[fi].sustenance;
					this.ctx.fillStyle = this.colors.food;
					this.ctx.fillRect(cx, cy, this.tilesize, this.tilesize);
					if (DEBUGGING) {
						this.ctx.fillStyle = this.colors.text;
						this.ctx.fillText(sustenance, tx, ty);
					}
				}
			}
		}
	};

	/**
	 * @description Draw a single cell.
	*/
	Canvas.prototype.onHover = function (e) {
		var pos = getCanvasMousePosition(canvas.canvas, e, true);
		pos.x *= this.tilesize;
		pos.y *= this.tilesize;
		this.render(false);
		this.ctx.globalAlpha = 0.6;
		this.ctx.fillStyle = this.colors[settings.simulation.spawnbrush];
		this.ctx.fillRect(pos.x, pos.y, this.tilesize, this.tilesize);
	};

	window.canvas = new Canvas(document.querySelector('canvas'));
})();