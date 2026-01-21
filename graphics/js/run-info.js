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
		init()
		if (newVal) {
			updateSceneFields(newVal);
			updateAddtionsBundle(newVal);
		}
	});
	
	function init() {
		gameTitle.html("")
		gameCategory.html("")
		gameSystem.html("")
		gameEstimate.html("")
		player.html("")
		twitch.html("")
		youtube.html("")
		twitter.html("")
		commentator.html("")
		cTwitch.html("")
		cYoutube.html("")
		cTwitter.html("")

	}

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

		// 解説更新 (nodecg-commentator-manager から取得)
		nodecg.readReplicant('activeRunCommentators', 'nodecg-commentator-manager', commentators => {
			updateCommentatorInfo(commentators);
		});
	}

	function updateCommentatorInfo(commentators) {
		// 初期化
		cTwitch.html("-");
		cYoutube.html("-");
		cTwitter.html("-");
		commentator.html("");
		
		// activeRunCommentators が存在し、配列に要素がある場合
		if (commentators && commentators.length) {
			// URL のハッシュ (#1, #2 など) で解説者番号を指定可能
			var commentatorNumber = parseInt(window.location.hash.replace('#', '')) || 0;
			
			// 指定された番号の解説者が存在する場合
			if (commentators[commentatorNumber]) {
				var currentCommentator = commentators[commentatorNumber];
				
				// 名前を表示
				commentator.html(currentCommentator.name);
				
				// SNS アカウントがあれば表示
				if (currentCommentator.social.twitch) {
					cTwitch.html(currentCommentator.social.twitch);
				}
				if (currentCommentator.social.youtube) {
					cYoutube.html(currentCommentator.social.youtube);
				}
				if (currentCommentator.social.twitter) {
					cTwitter.html(currentCommentator.social.twitter);
				}
			}
		}
	}
});