'use strict';
$(() => {
	// The bundle name where all the run information is pulled from.
	var speedcontrolBundle = 'nodecg-speedcontrol';
	
	// JQuery selectors.
	var gameTitle = $('#gameTitle');
	var gameCategory = $('#gameCategory');
	var gameSystem = $('#gameSystem');
	var gameEstimate = $('#gameEstimate');
	
	// This is where the information is received for the run we want to display.
	// The "change" event is triggered when the current run is changed.
	var runDataActiveRun = nodecg.Replicant('runDataActiveRun', speedcontrolBundle);
	runDataActiveRun.on('change', (newVal, oldVal) => {
		if (newVal)
			updateSceneFields(newVal);
	});
	
	// Sets information on the pages for the run.
	function updateSceneFields(runData) {
		gameTitle.html(runData.game); // game-title.html
		gameCategory.html(runData.category); // game-category.html
		gameSystem.html(runData.system); // game-system.html
		gameEstimate.html(runData.estimate); // game-estimate.html
	}
});