$(function() {

	var shippingMethods;

	function getShippingOptions() {
		var div = $('<div>');
		div.append('<option value="">Choose Shipping Option</option>');
		Object.keys(shippingMethods).forEach(function(key) {
			if (key.indexOf('FREIGHT') === -1)
				div.append($('<option>', { value: key }).text(shippingMethods[key]));
		});
		return div.html();
	}

	glut.shipping.methods()
	.then(function(methods) {
		shippingMethods = methods;
		$('.country').trigger('change');
		return true;
	})
	.catch(function(err) {
		console.log(err);
		alert('An error occurred while loading this page.');
	});

	$('[data-toggle]').on('change', function() {
		if ($(this).prop('checked'))
			$($(this).data('toggle')).hide();
		else
			$($(this).data('toggle')).show();
	}).trigger('change');

	var states = $('#us-states').html();
	$('select[name="shipping-state"]').html(states);
	$('select[name="payment-state"]').html(states);

	$('.country').on('change', function() {

		var $country = $(this);
		var name = $country.attr('name');
		var prefix = name.split('-')[0];
		var international;

		$state = $country.closest('[data-address-group]').find('.state');
		if ($country.val() === 'US')
			$state.replaceWith($('#us-states').html());
		else if ($country.val() === 'CA')
			$state.replaceWith($('#canada-states').html());
		else
			$state.replaceWith($('#international-states').html());

		$country.closest('[data-address-group]').find('.state').attr('name', prefix + '-state');

		if ($country.val() === 'US')
			$country.closest('[data-address-group]').find('.zipcode').attr('placeholder', 'zipcode');
		else
			$country.closest('[data-address-group]').find('.zipcode').attr('placeholder', 'postalcode');

		if (name === 'shipping-country' && shippingMethods) {
			$('[name=shipping-method]').html(getShippingOptions());
			international = $country.val() !== 'US';
			$('[name=shipping-method] option').each(function() {
				var $option = $(this);
				if ($option.val() === '')
					true;
				else if (international && $option.val().indexOf('INTERNATIONAL') === -1)
					$option.remove();
				else if (!international && $option.val().indexOf('INTERNATIONAL') > -1)
					$option.remove();
			});
		}

	});

	$('form.checkout').submit(function(ev) {
		ev.preventDefault();
	});

});
