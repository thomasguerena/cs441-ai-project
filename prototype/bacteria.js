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
		this.heading = { x: 0, y: 0 };
		while (this.heading.x == 0 && this.heading.y == 0) {
			// Random headings are fine so long as food can be detected within
			// some non-adjacent proximity.
			this.heading = {
				x: Math.random() > 0.5 ? -Math.round(Math.random()) : Math.round(Math.random()),
				y: Math.random() > 0.5 ? -Math.round(Math.random()) : Math.round(Math.random())
			};
		}
	};

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

		if (this.energy < 1) environment.remove(this);
	};

	Bacteria.prototype.move = function () {

		var COST = 1;
		var emptyAdj = environment.getEmptyAdjacent(this).bacteria;

		if (emptyAdj.length > 0) {
			environment.remove(this);
			this.x += this.heading.x;
			this.y += this.heading.y;
			this.energy -= COST;
			environment.add(this);
		} else {
			// TODO - yield action
			console.log('Cannot move...'); //rmv
		}
	}

	Bacteria.prototype.eat = function () {

		var adjFood = environment.getAdjacent(this).food;
		var nearbyFood = null;

		if (adjFood.length == 0) {
			this.move();
			nearbyFood = this.senseFood();
			if (nearbyFood) {
				this.heading.x = nearbyFood.x > this.x ? 1 : -1;
				this.heading.y = nearbyFood.y > this.y ? 1 : -1;
			}
		} else {
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

	/**
	 * @returns {Obj} xy-coordinate pair of a nearby food cell.
	*/
	Bacteria.prototype.senseFood = function () {
		// By getting adjacent food from one cell north,
		// south, east, and west of our current location,
		// we effectively search radially outward. This
		// does search some cells mutiple times, but the
		// performance differences should be unnoticable.
		var north = environment.getAdjacent({ x: this.x, y: this.y + 1 }).food;
		var south = environment.getAdjacent({ x: this.x, y: this.y - 1 }).food;
		var east = environment.getAdjacent({ x: this.x + 1, y: this.y }).food;
		var west = environment.getAdjacent({ x: this.x - 1, y: this.y }).food;
		var nearbyFood = north.concat(south, east, west);

		if (nearbyFood.length) return nearbyFood[0];
		else return null;
	};
})();