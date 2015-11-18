(function () {
	'use strict';

	window.settings = {
		// Default Simulation Settings
		simulation: {
			// Possible values: bacteria, antibiotic, food
			spawnbrush: 'food'
		},

		// Default Environment Settings
		environment: {
			n: 16 // height and width
		},

		// Default Antibiotic Settings
		antibiotic: {
			emergence: 100
		},

		// Default Bacteria Settings
		bacteria: {
			energy: 50,
			thresholds: { lower: 33, upper: 66 },
			priorities: {
				first: 'mate',
				second: 'food',
				third: 'replicate'
			},
			cost: {
				move: 1,
				mate: 15,
				replicate: 35
			},
			mutationRate: 5, // %
			mutationStep: 10
		},

		food: {
			sustenance: 80
		}
	};

})();