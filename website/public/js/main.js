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
			height: h + 20
		});
	},10));
});
$('#mobileNavToggle').click(function(ev){
	ev.preventDefault();
	var $body = $('body');
	if ($body.hasClass('menuOpen')) {
		$body.removeClass('menuOpen');
	} else {
		$body.addClass('menuOpen');
	}
});