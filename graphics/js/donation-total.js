'use strict';
$(() => {
	// The bundle name where all the run information is pulled from.
	var speedcontrolBundle = 'nodecg-speedcontrol';
	
	// JQuery selectors.
	var donationTotalElem = $('#donationTotal'); // donation-total.html
	
	// This is where the donation total is received.
	// The "change" event is triggered when the donation total changes.
	// Here, we're listening for the Tiltify total by default.
	// These are the other replicants you could use (might need some other tweaks):
	// g4gDonationTotal - Gaming4Good
	// srcomDonationTotal - Speedrun.com
	var donationTotal = nodecg.Replicant('tiltifyDonationTotal', speedcontrolBundle);
	donationTotal.on('change', (newVal, oldVal) => {
		// There's no old value on initial page load, so no animation is needed.
		if (!oldVal) {
			// "toLocaleString" adds commas to the donation total.
			var value = newVal.toLocaleString('en-US', {minimumFractionDigits: 0});
			donationTotalElem.html('$'+value); // donation-total.html
		}
		
		else
			animateDonationTotal(donationTotalElem, oldVal, newVal);
	});
	
	// A simple 4s animation for the donation total using jquery.animateNumber.
	function animateDonationTotal(selector, oldVal, newVal) {
		$(selector)
		.prop('number', oldVal)
		.animateNumber({
			number: newVal,
			numberStep: function(now, tween) {
				var flooredNumber = Math.floor(now);
				var target = $(tween.elem);
				var value = flooredNumber.toLocaleString('en-US', {minimumFractionDigits: 0});
				target.html('$'+value); // donation-total.html
			}
		}, 4000, 'linear');
	}
});