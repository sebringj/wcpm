$(window).resize(function(){
	$('#mobileMenu .nav').css({
		height: 10000
	});
	if ($(window).data('iosorientationfix')) {
		clearInterval($(window).data('iosorientationfix'));
	}
	$(window).data('iosorientationfix', setTimeout(function(){
		var h = $(window).height();
		$('#mobileMenu .nav').css({
			height: 'auto'
		});
	},10));
});
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