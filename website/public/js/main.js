$('#mobileNavToggle').click(function(ev){
	ev.preventDefault();
	var $mobileMenu = $('#mobileMenu'),
	$contentContainer = $('#contentContainer');
	if ($mobileMenu.hasClass('open')) {
		$mobileMenu.removeClass('open');
		$contentContainer.removeClass('open');
	} else {
		$mobileMenu.addClass('open');
		$contentContainer.addClass('open');
	}
});