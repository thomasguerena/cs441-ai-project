(function () {
	'use strict';

	window.Bacteria = function (x, y, diversity) {

		var that = this;
		this.age = 0; // number of generations survived
		this.energy = settings.bacteria.energy;
		this.diversity = diversity > -1 ? diversity : 0;
		this.actions = { // goal-oriented functions stored by goal
			food: function () { that.eat(); }, // search for food, eat food
			mate: function () { that.mate(); }, // search for mate, mate
			replicate: function () { that.replicate(); } // replication
		};
		// FIXME - doesn't handle collisions
		this.x = x > -1 ? x : Math.floor(Math.random()*environment.n);
		this.y = y > -1 ? y : Math.floor(Math.random()*environment.n);
		this.heading = { x: -1, y: 0 }; // TODO - how is this decided?
	};

	/**
	 * @returns {Boolean}
	 *   true: The bacteria cell survives this generation.
	 *   false: The bacteria cell dies this generation.
	*/
	Bacteria.prototype.update = function () {

		this.age += 1; // age one generation

		this.mutate(); // potentially mutate

		// Consider possible actions
		if (this.energy < settings.bacteria.thresholds.lower) {
			console.log('Goal: ' + settings.bacteria.priorities.first); //rmv
			this.actions[settings.bacteria.priorities.first]();
		}
		else if (this.energy < settings.bacteria.thresholds.upper) {
			console.log('Goal: ' + settings.bacteria.priorities.second); //rmv
			this.actions[settings.bacteria.priorities.second]();
		}
		else {
			console.log('Goal: ' + settings.bacteria.priorities.third); //rmv
			this.actions[settings.bacteria.priorities.third]();
		}

		return this.energy > 0;
	};

	Bacteria.prototype.move = function () {

		// TODO - this is old code from environment
		var COST = 1;
		var emptyAdj = environment.getEmptyAdjacent(this).bacteria;

		if (emptyAdj.length > 0) {
			this.x += this.heading.x;
			this.y += this.heading.y;
			this.energy -= COST;
		} else {
			// TODO - yield action
			console.log('Cannot move...'); //rmv
		}

		// var bl = this.bacteriaList.slice(); // create copy
		// for (var i = 0; i < bl.length; ++i) {
		// 	if (bl[i] != null) {
		// 		var move = Number(bl[i].dna[0]);
		// 		var decision = 0;
		// 		var emptyAdj = this.getEmptyAdjacent(bl[i]).bacteria;
		// 		var adjAntibiotic = this.getAdjacent(bl[i]).antibiotic;
		// 		var availableIndex = move % emptyAdj.length;

		// 		if (emptyAdj.length == 0) continue;

		// 		availableIndex = (availableIndex + adjAntibiotic.length) % emptyAdj.length;
		// 		decision = emptyAdj[availableIndex];
		// 		this.remove(bl[i]);
		// 		bl[i].x = decision.x;
		// 		bl[i].y = decision.y;
		// 		this.add(bl[i]);
		// 	}
		// }
	}

	Bacteria.prototype.eat = function () {

		var adjFood = environment.getAdjacent(this).food;

		if (adjFood.length == 0) {
			console.log('searching for food!'); //rmv
			this.move();
		} else {
			console.log('eating!'); //rmv
			this.energy += adjFood[0].munch();
		}
	};

	Bacteria.prototype.mate = function (potentialMates) {

		console.log('mate!'); //rmv

		// TODO - this is old code from environment

		// if (potentialMates.length === 0) return null;
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

	Bacteria.prototype.replicate = function () {

		console.log('replicate!'); //rmv

		var COST = 35; // energy cost of replication
		var rx = -1;
		var ry = -1;
		var rd = this.diversity;
		var emptyAdj = environment.getEmptyAdjacent(this).bacteria;

		if (emptyAdj.length > 0) {
			var i = Math.floor(Math.random()*emptyAdj.length);
			rx = emptyAdj[i].x;
			ry = emptyAdj[i].y;
			environment.add(new Bacteria(rx, ry, rd));
			this.energy -= COST;
		} else {
			// TODO - yield to a lower priority action?
			console.log('Unable to replicate. Yield!'); //rmv
		}
	};

	Bacteria.prototype.mutate = function () {
		if (Math.floor(Math.random()*100) < settings.bacteria.mutationRate) {
			this.diversity += settings.bacteria.mutationStep;
		}
	};
})();