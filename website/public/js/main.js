$('#mobileNavToggle').click(function(ev){
	ev.preventDefault();
	var $mobileMenu = $('#mobileMenu');
	if ($mobileMenu.hasClass('open')) {
		$mobileMenu.removeClass('open')
	} else {
		$mobileMenu.addClass('open');
	}
});