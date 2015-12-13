$(function() {

	if (glut.cart.list().length < 1) {
		location = '/cart';
		return;
	}

	var shippingMethods;
	var products;

	function getOptions(options, label) {
		var div = $('<div>');
		if (label)
			div.append('<option value="">' + label + '</option>');
		Object.keys(options).forEach(function(key) {
			if (!/(FREIGHT|2_DAY|HOME|SATURDAY_DELIVERY|FIRST|SMART_POST)/.test(key))
				div.append($('<option>', { value: key }).text(options[key]));
		});
		return div.html();
	}

	var itemTemplate = _.template($('#itemTemplate').html());
  var totalsTemplate = _.template($('#totalsTemplate').html());
	var shippingCost = 0;

	function renderSummary() {
		var subtotal = 0;
		var html = [];
		glut.cart.list().forEach(function(item) {
			var itemSubtotal = item.msrp * item.quantity;
			subtotal += itemSubtotal;
			html.push(itemTemplate({
				name: item.name,
				msrp: item.msrp.toFixed(2),
				subtotal: itemSubtotal.toFixed(2),
				quantity: item.quantity,
				href: item.href
			}));
		});
		var tax = 0.08 * subtotal;
		html.push(totalsTemplate({
			subtotal: subtotal.toFixed(2),
			tax: tax.toFixed(2),
			shipping: shippingCost.toFixed(2),
			shippingMethod: $('[name=shipping-method] option:selected').text(),
			total: (subtotal + tax + shippingCost).toFixed(2)
		}));
		$('#summary').html(html.join(''));
	}

	renderSummary();

	glut.shipping.methods()
	.then(function(methods) {
		shippingMethods = methods;
		$('.country').trigger('change');
		return glut.payment.methods();
	})
	.then(function(methods) {
		$('[name=payment-cardtype]').html(getOptions(methods, 'Choose Card'));
	})
	.catch(function(err) {
		$('#errorModal').find('.message').text('An error occurred while loading this page.').end().modal({ show: true });
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

	// handle domestic and international related choices
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

		if (name === 'shipping-country' && shippingMethods) {
			$('[name=shipping-method]').html(getOptions(shippingMethods, 'Choose Shipping Option'));
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

	// calculate est. shipping
	$('[data-ship-to]').on('change', _.debounce(function() {
		var isFilledOut = true;
		$('[data-ship-to] input[required]:visible, [data-ship-to] select[required]:visible').each(function() {
			if ($(this).val().trim() === '')
				isFilledOut = false;
		});
		$('#shippingCalculation').text('');
		shippingCost = 0;
		if (!isFilledOut)
			return;

		var streets = [];
		streets.push($('[name=shipping-address]').val());
		if ($('[name=shipping-address2]').val())
			streets.push($('[name=shipping-address2]').val());

		products = _.map(glut.cart.list(), function(product) {
			return { upc: product.upc, quantity: product.quantity };
		});

		glut.shipping.rates({
			shippingMethod: $('[name=shipping-method]').val(),
			products: products,
			address: {
				streets: streets,
				city: $('[name=shipping-city]').val(),
				stateOrProvinceCode: $('[name=shipping-state]').val(),
				postalCode: $('[name=shipping-zipcode]').val(),
				countryCode: $('[name=shipping-country]').val()
			}
		})
		.then(function(rates) {
			var amount = parseFloat(_.get(rates, 'total.amount'));
			if (isNaN(amount)) {
				$('#shippingCalculation').text('Not available.');
				return false;
			}
			shippingCost = amount;
			$('#shippingCalculation').text('$' + amount.toFixed(2));
			renderSummary();
			return true;
		})
		.catch(function(err) {
			console.error(err);
		});

	}, 1000));

	var emailRe = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	var submitBlock = false;
	$('form.checkout').on('keyup change', 'input, select, textarea', function() {
		$(this).removeClass('error');
		$('#errorMessageContainer').slideUp('fast');
	})
	$('form.checkout').submit(function(ev) {
		ev.preventDefault();

		if (submitBlock)
			return;

		submitBlock = true;

		var isValid = true;
		var message = [];

		$('form.checkout').find('input, select, textarea').each(function() {
			var $this = $(this);
			if ($this.is(':hidden') || !$this.is('[required]'))
				return;

			var label = ($this.data('label') || $this.attr('name'));
			var error = false;
			if ($this.attr('type') === 'email' && !emailRe.test($this.val())) {
				error = true;
				if ($this.val().trim() === '')
					message.push(label  + ' is required.');
				else
					message.push(label  + ' is not an email address.');
			} else if ($this.val().trim() === '') {
				error = true;
				message.push(label  + ' is required.');
			}
			if (error) {
				$this.addClass('error');
				isValid = false;
			}
			else
				$this.removeClass('error');
		});

		if (!isValid) {
			$('#errorMessage').html(message.join('<br>'));
			$('#errorMessageContainer').slideDown('fast');
		} else
			$('#errorMessageContainer').slideUp('fast');

		if (!isValid) {
			submitBlock = false;
			return;
		}

		$('#waitingModal').modal({ show: true, backdrop: 'static', keyboard: false });

		var sameContact = !!$('[name=same-contact]:checked').length;
		var sameAddress = !!$('[name=same-address]:checked').length;

		var shippingStreets = [$('[name=shipping-address]').val()];
		if ($('[name=shipping-address2]').val().trim() !== '')
			shippingStreets.push($('[name=shipping-address2]').val());

		var paymentStreets;
		if (sameAddress)
			paymentStreets = shippingStreets;
		else {
			paymentStreets = [$('[name=payment-address]').val()];
			if ($('[name=payment-address2]').val().trim() !== '')
				shippingStreets.push($('[name=payment-address2]').val());
		}

		function getActor(contactPrefix, addressPrefix) {
			return {
				contact: {
					firstName: $('[name=' + contactPrefix + '-firstname]').val(),
					lastName: $('[name=' + contactPrefix + '-lastname]').val(),
					email: $('[name=' + contactPrefix + '-email]').val(),
					phone: $('[name=' + contactPrefix + '-phone]').val()
				},
				address: {
					streets: paymentStreets,
					city: $('[name=' + addressPrefix + '-city]').val(),
					stateOrProvince: $('[name=' + addressPrefix + '-state]').val(),
					countryCode: $('[name=' + addressPrefix + '-country]').val(),
					postalCode: $('[name=' + addressPrefix + '-zipcode]').val()
				}
			};
		}

		var transaction = {
			shippingMethod: $('[name=shipping-method]').val(),
			products: products,
			cardNumber: $('[name=payment-number]').val().replace(/[^0-9]+/gim, ''),
			cvv2: $('[name=security-code]').val(),
			expMonth: $('[name=month]').val(),
			expYear: $('[name=year]').val(),
			payer: getActor(sameContact ? 'shipping' : 'payment', sameAddress ? 'shipping' : 'payment'),
			recipient: getActor('shipping', 'shipping')
		};

		glut.transactions.transact(transaction)
		.then(function() {
			$('#waitingModal').modal('hide');
			glut.cart.clear();
			$('.hide-for-receipt').hide();
			$('.show-for-receipt').show();
			window.scrollTo(0, 0);
		})
		.catch(function(err) {
			$('#waitingModal').modal('hide');
			var message = 'We\'re sorry, an error occurred while attempting your transaction.';
			if (err && err.message)
				message = err.message;
			$('#errorModal').find('.message').text(message).end().modal({ show: true });
			submitBlock = false;
		});

	});

	$('#completePurchase').on('click', function() {
		$('form.checkout').trigger('submit');
	});

});
