wcpm.forceSsl();

(function() {
  var cartContents = $('#cartContents');
  var cartItemTemplate = _.template($('#cartItemTemplate').html());
  var cartEmptyTemplate = _.template($('#cartEmptyTemplate').html());
  var cartSubtotalTemplate = _.template($('#cartSubtotalTemplate').html())

  function renderCart() {
    var html = [];
    var cartList = glut.cart.list();
    var subtotal = 0;
    if (cartList.length === 0)
      html.push(cartEmptyTemplate());
    else {
      glut.cart.list().forEach(function(item) {
        item.msrp = item.msrp.toFixed(2);
        html.push(cartItemTemplate(item));
      });
      html.push(cartSubtotalTemplate({ subtotal: glut.cart.subtotal().toFixed(2) }));
    }
    cartContents.html(html.join(''));
  }

  function isReturnKey(ev) {
    var key = ev.keyCode || ev.which;
    return key === 8;
  }

  // remove cart item
  cartContents.on('click', '.trash', function(ev) {
    var row = $(this).closest('[data-upc]');
    var item = glut.cart.find(row.data('upc'));
    glut.cart.remove(item);
  });

  // prevent bad quantity input
  cartContents.on('keydown', '.qtyInput', function(ev) {
    if (isReturnKey(ev))
      return;
    var key = ev.keyCode || ev.which;
    var keychar = String.fromCharCode(key);
    if (!/^[0-9]+$/.test(keychar))
      ev.preventDefault();
  });

  // handle quantity input change
  cartContents.on('keyup change', '.qtyInput', _.debounce(function(ev) {
    if (isReturnKey(ev))
      return;
    var input = $(this);
    var val = input.val();
    var row = input.closest('[data-upc]');
    var item = glut.cart.find(row.data('upc'));
    if (/^[0-9]+$/.test(val)) {
      var qty = parseInt(val);
      if (qty > 0)
        glut.cart.set(item, qty);
      else
        glut.cart.remove(item);
    }
  }, 250));

  glut.cart.on('change', renderCart);

})();
