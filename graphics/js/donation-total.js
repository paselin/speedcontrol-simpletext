'use strict';
$(() => {
	// The bundle name where all the information is pulled from.
	var tiltifyBundle = 'speedcontrol-tiltify'
	
	// JQuery selectors.
	var donationTotalElem = $('#donationTotal'); // donation-total.html
	
	// TO GET DONATION TOTALS, YOU MUST INSTALL AN EXTRA BUNDLE THAT SUPPLIES THEM (SEE THE nodecg-speedcontrol DOCUMENTATION).
	// This is where the donation total is received.
	// The "change" event is triggered when the donation total changes.
	// Here, we're listening for the Tiltify total by default.
	// These are the other replicants you could use (might need some other tweaks):
	// srcomDonationTotal - Speedrun.com
	var donationTotal = nodecg.Replicant('tiltifyDonationTotal', tiltifyBundle);
	donationTotal.on('change', (newVal, oldVal) => {
		// There's no old value on initial page load, so no animation is needed.
		if (!oldVal) {
			// Toggle the commenting on these lines if you don't want cents/pence on your donation totals.
			// ALSO SEE BELOW INSIDE animateDonationTotal.
			// Math.floor(newVal) removes the cents/pence.
			// "toLocaleString" adds commas to the donation total to separate 1000s.
			
			//var value = Math.floor(newVal).toLocaleString('en-US', {minimumFractionDigits: 0});
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
				var target = $(tween.elem);

				// Toggle the commenting on these lines if you don't want cents/pence on your donation totals.
				// ALSO SEE ABOVE INSIDE donationTotal.on('change').
				// Math.floor(now) removes the cents/pence.
				// "toLocaleString" adds commas to the donation total to separate 1000s.

				//var value = Math.floor(now).toLocaleString('en-US', {minimumFractionDigits: 0});
				var value = now.toLocaleString('en-US', {minimumFractionDigits: 0});

				target.html('$'+value); // donation-total.html
			}
		}, 4000, 'linear');
	}
});