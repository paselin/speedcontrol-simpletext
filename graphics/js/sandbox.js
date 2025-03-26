'use strict';
$(() => {
    // The bundle name where all the run information is pulled from.
    var speedcontrolBundle = 'nodecg-speedcontrol';
    var speedcontrolAdditionsBundle = 'speedcontrol-additions';
    var sandbox = $('#sandbox'); // sandbox.html

    var runDataActiveRun = nodecg.Replicant('runDataActiveRun', speedcontrolBundle);
	runDataActiveRun.on('change', (newVal, oldVal) => {
		if (newVal) {
            nodecg.readReplicant('commentatorArray', speedcontrolAdditionsBundle,runDatas => {
                var commentators = []
                runDatas.forEach( data => {
                    if (data.assignedRunIdArray.includes(newVal.id)) {
                        commentators.push(data);
                    }
                });
                if (commentators.length) {
                    sandbox.html(commentators[0].name);
                }
            });
        }
    });
});