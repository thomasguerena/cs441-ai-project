(function () {
	'use strict';

	window.Bacteria = function (x, y, dna) {
		this.birthGeneration = window.generation;
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

	Bacteria.prototype.age = function () {
		return window.generation - this.birthGeneration;
	};

	Bacteria.prototype.mutate = function () {
		var i = Math.floor(Math.random() * this.dna.length);
		this.dna = this.dna.substr(0, i)
				 + (Number(this.dna[i]) + 1)%10
				 + this.dna.substr(i + 1, this.dna.length);
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