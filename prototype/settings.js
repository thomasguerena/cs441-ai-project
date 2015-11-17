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
			energy: 20, // rmv
			// energy: 50,
			thresholds: { lower: 33, upper: 66 },
			priorities: {
				first: 'food',
				second: 'replicate',
				third: 'mate'
			},
			mutationRate: 50, // %
			mutationStep: 10
		},

		food: {
			sustenance: 80
		}
	};

})();