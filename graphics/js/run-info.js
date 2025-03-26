'use strict';
$(() => {
	// The bundle name where all the run information is pulled from.
	var speedcontrolBundle = 'nodecg-speedcontrol';
	var speedcontrolAdditionsBundle = 'speedcontrol-additions';
	
	// JQuery selectors.
	var gameTitle = $('#gameTitle'); // game-title.html
	var gameCategory = $('#gameCategory'); // game-category.html
	var gameSystem = $('#gameSystem'); // game-system.html
	var gameEstimate = $('#gameEstimate'); // game-estimate.html
	var player = $('#player'); // player.html
	var twitch = $('#twitch'); // twitch.html
	var youtube = $('#youtube'); // twitch.html
	var twitter = $('#twitter'); // twitch.html
	var commentator = $('#commentator'); // commentator.html
	var cTwitch = $('#c-twitch'); // commentator.html
	var cYoutube = $('#c-youtube'); // commentator.html
	var cTwitter = $('#c-twitter'); // commentator.html
	
	// This is where the information is received for the run we want to display.
	// The "change" event is triggered when the current run is changed.
	var runDataActiveRun = nodecg.Replicant('runDataActiveRun', speedcontrolBundle);
	runDataActiveRun.on('change', (newVal, oldVal) => {
		if (newVal) {
			updateSceneFields(newVal);
			updateAddtionsBundle(newVal);
		}
	});
	
	// Sets information on the pages for the run.
	function updateSceneFields(runData) {
		gameTitle.html(runData.game); // game-title.html
		gameCategory.html(runData.category); // game-category.html
		gameSystem.html(runData.system); // game-system.html
		gameEstimate.html(runData.estimate); // game-estimate.html
		
		// Checks if we are on the player.html/twitch.html page.
		// This is done by checking if the #player/#twitch span exists.
		var playerNumber = parseInt(window.location.hash.replace('#', '')) || 1;
			
		// Arrays start from 0 and not 1, so have to adjust for that.
		var team = runData.teams[playerNumber-1];
		if (team) {
			if (player.length) {
				player.html(team.players.map((playerMaps) => playerMaps.name).join(', '));
			}
	
			if (twitch.length) {
				var twitchList = [];
				for (var playerData of team.players) {
					if (playerData.social.twitch) {
						twitchList.push(playerData.social.twitch);
					} else {
						twitchList.push("-");
					}
				}
				twitch.html(twitchList.join(', '));
			}
		}
	}

	function updateAddtionsBundle(runData) {
		// ソーシャル系更新
		nodecg.readReplicant('speedcontrolUserAdditionArray', speedcontrolAdditionsBundle,userDatas => {
			console.log(userDatas)
			if (youtube.length || twitter.length) {
				var playerNumber = parseInt(window.location.hash.replace('#', '')) || 1;
				var team = runData.teams[playerNumber-1];
				if (team) {
					var playerIds = []
					var playerYT = []
					var playerTwitter = []
					for (var player of team.players) {
						playerIds.push(player.id)
						playerYT.push("-")
						playerTwitter.push("-")
					}
					if (playerIds.length) {
						for (const [index,id] of Object.entries(playerIds)) {
							for (var data of userDatas) {
								if (data.id === id) {
									if (data.social.youtube) {
										playerYT[index] = data.social.youtube;	
									}
									if (data.social.twitter) {
										playerTwitter[index] = data.social.twitter;
									}
									break
								}
							}
						}

						youtube.html(playerYT.join(', '));
						twitter.html(playerTwitter.join(', '));
					}
				}
			}
		})

		// 解説更新
		nodecg.readReplicant('commentatorArray', speedcontrolAdditionsBundle,runDatas => {
			var commentators = []
			runDatas.forEach( data => {
				if (data.assignedRunIdArray.includes(runData.id)) {
					commentators.push(data);
				}
			});
			if (commentators.length) {
				var commentatorNumber = parseInt(window.location.hash.replace('#', '')) || 0;
				commentator.html(commentators[commentatorNumber].name);
				if (commentators[commentatorNumber].social.twitch) {
					cTwitch.html(commentators[commentatorNumber].social.twitch);
				} else {
					cTwitch.html("-");
				}
				if (commentators[commentatorNumber].social.youtube) {
					cYoutube.html(commentators[commentatorNumber].social.youtube);
				} else {
					cYoutube.html("-");
				}
				if (commentators[commentatorNumber].social.twitter) {
					cTwitter.html(commentators[commentatorNumber].social.twitter);
				} else {
					cTwitter.html("-");
				}
			} else {
				commentator.html("");
			}
		});
	}
});