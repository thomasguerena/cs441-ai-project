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

	// Initialize bacteria goal priorities
	function initGoals () {
		$('.priority-list > li:nth-child(1)').html(settings.bacteria.priorities.third);
		$('.priority-list > li:nth-child(3)').html(settings.bacteria.priorities.second);
		$('.priority-list > li:nth-child(5)').html(settings.bacteria.priorities.first);
	}
	// ...
	initGoals();

	// Set event handlers for swapping goal orders
	$('.priority-list > .swapper').on('click', function () {
		var temp = null;
		if ($(this).index() == 1) {
			temp = settings.bacteria.priorities.third;
			settings.bacteria.priorities.third = settings.bacteria.priorities.second;
			settings.bacteria.priorities.second = temp;
		} else {
			temp = settings.bacteria.priorities.second;
			settings.bacteria.priorities.second = settings.bacteria.priorities.first;
			settings.bacteria.priorities.first = temp;
		}
		initGoals();
	});

	// Set event handlers for entity spawn brushes
	$('.spawn-brush').on('click', function () {
		$('.spawn-brush.selected').removeClass('selected');
		$(this).addClass('selected');
		settings.simulation.spawnbrush = $(this).children('span').html();
	});

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

})();