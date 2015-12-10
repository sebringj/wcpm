// enable popout menu
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
//
$('#mobileNavToggle').click(function(ev){
	ev.preventDefault();
	var $body = $('body');
	if ($body.hasClass('menuOpen')) {
		$body.removeClass('menuOpen');
	} else {
		$body.addClass('menuOpen');
	}
});
$('#copyrightYear').text((new Date()).getFullYear());

$('form').on('submit', function(ev) {
	ev.preventDefault();

	var emailRe = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
	var blankRe = /^\s*$/;
	var $form = $(this);
	var isError = false;

	$form.find('input,textarea').each(function(){
		var $this = $(this);
		if (blankRe.test($this.val())) {
			$this.addClass('error');
			isError = true;
		}
		if ($this.attr('type') === 'email' && !emailRe.test($this.val())) {
			$this.addClass('error');
			isError = true;
		}
	});

	if (isError) { return; }

	$.post('/data/send-email',$form.serialize())
	.always(function(){
		$form.find('input,textarea').each(function(){
			$(this).val('');
		});
		alert('Thank you! We\'ll get back to you as soon as possible.');
	});
})
.attr('novalidate','novalidate')
.find('textarea,input,select').each(function(){
	$(this).attr('autocomplete','off').on('focus',function(){
		$(this).removeClass('error');
	});
});

glut.config.api = 'http://api.glut.io/api';

glut.cart.on('change', function handleCartChange() {
	var totalQuantity = glut.cart.totalQuantity();
	if (totalQuantity > 0)
		$('#cartIndicator').find('.qty').text(totalQuantity + '').end().css({ display: 'block' });
	else
		$('#cartIndicator').hide();
});
