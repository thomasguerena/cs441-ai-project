(function () {
	'use strict';

	var Canvas = function (canvas) {
		var that = this;
		this.canvas = canvas;
		this.ctx = this.canvas.getContext('2d');
		this.ctx.textAlign = 'center';
		this.ctx.font = '18px Helvetica';
		this.tilew = Math.floor(this.canvas.width/settings.environment.width);
		this.tileh = Math.floor(this.canvas.width/settings.environment.height);

		this.colors = {
			background: '#002b36',
			text: '#FCFEFB',
			food: '#6c71c4',
			bacteria: '#859900',
			antibiotic: '#dc322f',
			challenge: '#b58900'
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
		for (var i = 0; i < environment.w; ++i) {
			for (var j = 0; j < environment.h; ++j) {
				var cx = this.tilew*i;
				var cy = this.tileh*j;
				var tx = cx + this.tilew/2;
				var ty = (cy + this.tileh/2) + 5;
				var ai = environment.antibioticMatrix[i][j];
				var bi = environment.bacteriaMatrix[i][j];
				var fi = environment.foodMatrix[i][j];
				this.ctx.globalAlpha = 1;

				// TODO Change PROB(survival) calculations

				// TODO - isn't there a better way of doing this? Do we care?

				if (ai >= 0 && bi >= 0) {
				 	var psurvival = 1 - environment.antibioticList[ai].potency/100;
				 	this.ctx.fillStyle = this.colors.challenge;
					this.ctx.fillRect(cx, cy, this.tilew, this.tileh);
					if (DEBUGGING) {
						this.ctx.fillStyle = this.colors.text;
						this.ctx.fillText(psurvival, tx, ty);
					}
				} else if (ai >= 0) {
					var potency = environment.antibioticList[ai].potency;
					this.ctx.globalAlpha = potency/settings.antibiotic.potency;
					this.ctx.fillStyle = this.colors.antibiotic;
					this.ctx.fillRect(cx, cy, this.tilew, this.tileh);
					if (DEBUGGING) {
						this.ctx.globalAlpha = 1;
						this.ctx.fillStyle = this.colors.text;
						this.ctx.fillText(potency, tx, ty);
					}
				} else if (bi >= 0) {
					var dna = environment.bacteriaList[bi].dna;
					this.ctx.fillStyle = this.colors.bacteria;
					this.ctx.fillRect(cx, cy, this.tilew, this.tileh);
					if (DEBUGGING) {
						this.ctx.fillStyle = this.colors.text;
						this.ctx.fillText(dna, tx, ty);
					}
				} else if (fi >= 0) {
					var sustenance = environment.foodList[fi].sustenance;
					this.ctx.fillStyle = this.colors.food;
					this.ctx.fillRect(cx, cy, this.tilew, this.tileh);
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
		pos.x *= this.tilew;
		pos.y *= this.tileh;
		this.render(false);
		this.ctx.globalAlpha = 0.6;
		this.ctx.fillStyle = this.colors[settings.simulation.spawnbrush];
		this.ctx.fillRect(pos.x, pos.y, this.tilew, this.tileh);
	};

	window.canvas = new Canvas(document.querySelector('canvas'));
})();