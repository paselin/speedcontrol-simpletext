'use strict';
$(() => {
	// The bundle name where all the run information is pulled from.
	var speedcontrolBundle = 'nodecg-speedcontrol';

    // JQuery selectors
    var gameTitle = $('#nextGameTitle'); // next/game-title.html
    var gameCategory = $('#nextGameCategory'); // next/game-category.html
    var gameEstimate = $('#nextGameEstimate'); // next/game-estimate.html
    var player = $('#nextPlayer'); // next/game-player.html
    
    
    
    var runDataActiveRun = nodecg.Replicant('runDataActiveRun', speedcontrolBundle);
    runDataActiveRun.on('change', (newVal, oldVal) => {
        if (newVal) {
            nodecg.readReplicant('runDataArray', speedcontrolBundle, runDatas => {
                var currentFound = false;
                var nextRunDatas = [];  
                console.log(typeof runDatas)  ;
				runDatas.forEach(runData => {
					if (currentFound) {
						nextRunDatas.push(runData);
					}
					if (runData.id === newVal.id) {
						currentFound = true;
					}
				});
				updateNextFields(nextRunDatas);	
			});

        }
    });

    function updateNextFields(runDatas) {
        var index = parseInt(window.location.hash.replace('#', '')) || 0;
        var runData = runDatas[index];
        console.log(index);
        console.log(runData);
        console.log(gameTitle);
        gameTitle.html(runData.game);
        gameCategory.html(runData.category);
        gameEstimate.html(runData.estimate);

        // playerの部分はチームを考慮する
        var playerName = ""
        var teams = runData.teams;
        teams = teams.map(data => {
            return data
        });
        console.log(typeof teams);
        if (teams.length > 1) {
            teams.forEach((team,index,array) => {
                playerName += team.players.map((player) => player.name).join(', ')
                if (index !== (array.length - 1)) {
                    playerName += " vs. ";
                }
            });    
        } else {
            let team = runData.teams[0];
            playerName = team.players.map((player) => player.name).join(', ')
        }
        player.html(playerName);
    }

});


