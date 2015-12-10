$(function() {
	var product;

	var upc = $('[data-upc]').data('upc');

	if (!upc)
		return;

	glut.products.list(upc)
	.then(function(products) {
		if (products.length)
			product = products[0];
	})
	.catch(function(err) {
		console.error(err);
	});

	$('#buyButton').on('click', function() {
		var qty = parseInt($('#qtyInput').val());
		if (!/^[0-9]+$/.test(qty)) {
			qty = 1;
			$('#qtyInput').val(qty);
		}
		glut.cart.set(product, qty);
		location = '/cart';
	});
});
