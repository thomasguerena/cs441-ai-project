(function () {
	'use strict';

	// Initialize UI settings to defaults
	function initSlider (id, settings) {
		var slider = {};
		slider.root = document.getElementById(id);
		slider.input = slider.root.querySelector(':scope input');
		slider.span = slider.root.querySelector(':scope span');
		slider.input.value = settings[id];
		slider.span.innerHTML = settings[id];
		slider.input.addEventListener('input', function (e) {
			slider.span.innerHTML = e.target.value;
			settings[id] = Number(e.target.value);
		});
	}
	// ...
	initSlider('energy', settings.bacteria);
	initSlider('mutationRate', settings.bacteria);
	initSlider('mutationStep', settings.bacteria);
	initSlider('genx', settings.antibiotic);
	initSlider('potency', settings.antibiotic);
	initSlider('diffusal', settings.antibiotic);
	initSlider('sustenance', settings.food);
	initSlider('regenerationRate', settings.food);

	// Update the generation counter and the "doomsday" bar
	window.generationTick = function () {
		var msgbox = document.querySelector('.message-box');
		msgbox.innerHTML = 'Generation: ' + generation;
		if (generation > settings.antibiotic.genx) return;
		var pbar = document.querySelector('.progress-bar > div');
		var perc = 100*(generation / settings.antibiotic.genx);
		pbar.style.width = perc + '%';
	};

	// Present final bacterial defeat message
	window.bacteriaDefeated = function () {
		var msgbox = document.querySelector('.message-box');
		var msg = 'All bacteria dead after ' + generation;
		msg += generation > 1 ? ' generations!' : ' generation!';
		msgbox.innerHTML = msg;
	};

	// Present final bacterial victory message
	window.antibioticDefeated = function () {
		var msgbox = document.querySelector('.message-box');
		var msg = 'Antibiotic defeated after ' + generation;
		msg += generation > 1 ? ' generations!' : ' generation!';
		msgbox.innerHTML = msg;
	};

	// Set event handlers for entity spawn brushes
	var spawnbrushes = document.querySelectorAll('.spawn-brush');
	eachEl(spawnbrushes, function (brush) {
		brush.addEventListener('click', function (e) {
			if (hasClass(e.target, 'selected')) return;
			eachEl(spawnbrushes, function (b) {
				removeClass(b, 'selected');
			});
			addClass(e.target, 'selected');
			settings.simulation.spawnbrush = e.target.innerHTML;
		});
	});

	//

})();