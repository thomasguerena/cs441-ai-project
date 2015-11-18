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
		this.goal = 1; // default to first priority
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

	Bacteria.prototype.yieldGoal = function () {
		++this.goal;
		if (this.goal == 2) {
			this.actions[settings.bacteria.priorities.second]();
		}
		else if (this.goal == 3) {
			this.actions[settings.bacteria.priorities.third]();
		}
	};

	Bacteria.prototype.resetGoal = function () {
		this.goal = 1;
	};

	Bacteria.prototype.update = function () {

		this.age += 1; // age one generation
		this.resetGoal(); // reset actions to default
		this.mutate(); // potentially mutate

		// Consider possible actions
		if (this.energy < settings.bacteria.thresholds.lower) {
			this.actions[settings.bacteria.priorities.first]();
		}
		else if (this.energy < settings.bacteria.thresholds.upper) {
			this.actions[settings.bacteria.priorities.second]();
		}
		else {
			this.actions[settings.bacteria.priorities.third]();
		}

		if (this.energy < 1) environment.remove(this);
	};

	Bacteria.prototype.move = function () {
		var that = this;
		var emptyAdj = null;
		var availableMoves = null;

		if (this.energy < settings.bacteria.cost.move) this.yieldGoal();

		emptyAdj = environment.getEmptyAdjacent(this);
		availableMoves = emptyAdj.bacteria.intersect(emptyAdj.food,
			function (a, b) {
				return a.x == b.x && a.y == b.y;
		});

		if (availableMoves.length > 0) {
			environment.remove(this);

			if (!availableMoves.find(function (avail) {
				return avail.x == that.x + that.heading.x
					&& avail.y == that.y + that.heading.y;
			})) {
				var r = Math.floor(Math.random()*availableMoves.length);
				this.x = availableMoves[r].x;
				this.y = availableMoves[r].y;
			} else {
				this.x += this.heading.x;
				this.y += this.heading.y;
			}
			this.energy -= settings.bacteria.cost.move;
			environment.add(this);
		} else {
			this.yieldGoal();
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

		var adjBacteria = null;

		if (this.energy < settings.bacteria.cost.mate) this.yieldGoal();

		adjBacteria = environment.getAdjacent(this).bacteria;

		if (adjBacteria.length > 0) {
			this.energy -= settings.bacteria.cost.mate;
			this.diversity += 10; // TODO - maybe this should depend on the other's diversity
		}
		else {
			this.yieldGoal();
		}
	};

	Bacteria.prototype.replicate = function () {
		var rx = -1;
		var ry = -1;
		var rd = this.diversity;
		var emptyAdj = null;

		if (this.energy < settings.bacteria.cost.replicate) this.yieldGoal();

		emptyAdj = environment.getEmptyAdjacent(this).bacteria;

		if (emptyAdj.length > 0) {
			var i = Math.floor(Math.random()*emptyAdj.length);
			rx = emptyAdj[i].x;
			ry = emptyAdj[i].y;
			environment.add(new Bacteria(rx, ry, rd));
			this.energy -= settings.bacteria.cost.replicate;
		} else {
			this.yieldGoal();
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