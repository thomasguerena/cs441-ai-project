(function () {
	'use strict';

	window.settings = {
		// Default Simulation Settings
		simulation: {
			// Possible values: bacteria, antibiotic, food
			spawnbrush: 'bacteria'
		},

		// Default Environment Settings
		environment: {
			width: 20,
			height: 20
		},

		// Default Antibiotic Settings
		antibiotic: {
			genx: 5,
			potency: 150,
			diffusal: 20
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
			sustenance: 80,
			regenerationRate: 25
		}
	};

})();