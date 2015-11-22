(function () {
	'use strict';


	/*-- Simulation Parameter Sliders --*/

	// Initialize sliders to defaults
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



	/*-- Entity Spawn Brushes --*/

	// Set event handlers for entity spawn brushes
	$('.spawn-brush').on('click', function () {
		$('.spawn-brush.selected').removeClass('selected');
		$(this).addClass('selected');
		settings.simulation.spawnbrush = $(this).children('span').html();
	});


	/*-- Bacteria Goal Priorities --*/

	// Initialize bacteria goal priorities
	function updateGoals () {

		// Priority list
		$('.priority-list > li:nth-child(1)').html(settings.bacteria.priorities.third);
		$('.priority-list > li:nth-child(3)').html(settings.bacteria.priorities.second);
		$('.priority-list > li:nth-child(5)').html(settings.bacteria.priorities.first);

		// Description
		var first = $('#priority-breakdown p:nth-child(1)');
		var second = $('#priority-breakdown p:nth-child(3)');
		var third = $('#priority-breakdown p:nth-child(5)');

		first.children('span:nth-child(1)').html(settings.bacteria.priorities.first);
		first.children('span:nth-child(2)').html(settings.bacteria.thresholds.upper);

		second.children('span:nth-child(1)').html(settings.bacteria.priorities.second);
		second.children('span:nth-child(2)').html(settings.bacteria.thresholds.upper);
		second.children('span:nth-child(3)').html(settings.bacteria.thresholds.lower);

		third.children('span:nth-child(1)').html(settings.bacteria.priorities.third);
		third.children('span:nth-child(2)').html(settings.bacteria.thresholds.lower);
	}
	// ...
	updateGoals();

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
		updateGoals();
	});

	// Initialize balanace of multi-sliders
	var $lowerThresholdSlider = $('.multi-slider-container > input:first-child');
	var $upperThresholdSlider = $('.multi-slider-container > input:last-child');
	$lowerThresholdSlider[0].value =settings.bacteria.thresholds.lower;
	$upperThresholdSlider[0].value = settings.bacteria.thresholds.upper;

	// Set event handlers to balance multi-slider
	$lowerThresholdSlider.on('input', function (e) {
		var lower = Number(e.target.value);
		if (lower + 1 >= $upperThresholdSlider[0].value) {
			$(this).attr('disabled', true);
		} else {
			settings.bacteria.thresholds.lower = lower;
			updateGoals();
		}
	}).on('change, blur', function (e) {
		$(this).attr('disabled', false);
	});

	$upperThresholdSlider.on('input', function (e) {
		var upper = Number(e.target.value);
		if (upper - 1 <= $lowerThresholdSlider[0].value) {
			$(this).attr('disabled', true);
		} else {
			settings.bacteria.thresholds.upper = upper;
			updateGoals();
		}
	}).on('change, blur', function () {
		$(this).attr('disabled', false);
	});


	/*-- Global UI Functions --*/

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

	// Flip start button between "start" and "reset"
	// @param {Boolean} running Whether the simulation is currently running.
	window.flipStartButton = function (running) {
		if (running === true) {
			$('button:nth-of-type(1)').html('reset');
		} else {
			$('button:nth-of-type(1)').html('start');
		}
	};

})();