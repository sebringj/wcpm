var config = require('config');
var kitgui = require('kitgui');
var request = require('request');

function getProduct(productId, callback) {
	request(config.glut.url + '/products?upc=' + productId, function(err, res, body) {
		if (err)
			return callback({ err: err });
		if (res.statusCode !== 200)
			return callback({ statusCode: res.statusCode });
		var json;
		try {
			json = JSON.parse(body);
		} catch(ex) {
			return callback({ ex: ex });
		}
		if (Array.isArray(json) && json.length === 1)
			return callback(json[0]);
		callback({ err: 'not array' });
	});
}

module.exports.set = function(context) {

	context.app.get('/products/:name', function(req, res) {

		var cacheKey = 'product-' + req.params.name;
		var pageID = cacheKey;

		function render() {
			res.render('product', {
				layout: context.cache.layout,
				kitguiAccountKey: config.kitgui.accountKey,
				pageID: cacheKey,
				items: context.cache[cacheKey].items,
				title: context.cache[cacheKey].title,
				description: context.cache[cacheKey].description,
				vars: context.cache[cacheKey].vars || {},
				product: context.cache[cacheKey].product
			});
		}

		if (req.cookies.kitgui) {
			delete context.cache[cacheKey];
		}
		if (context.cache[cacheKey]) {
			render();
			return;
		}
		kitgui.getContents({
			basePath: config.kitgui.basePath,
			host: config.kitgui.host,
			pageID: pageID,
			url: 'http://' + config.domain + req.path,
			items: [
				{ id: pageID + 'Title', editorType: 'inline' },
				{ id: pageID + 'Image', editorType: 'image' },
				{ id: pageID + 'Description', editorType: 'html' }
			]
		}, function(kg) {
			var match;
			if (typeof kg.items[pageID + 'Image'].content === 'string') {
				match = kg.items[pageID + 'Image'].content.match(/"([^"]+)"/img);
				match[0] = match[0].replace(/("|http:)/gmi, '');
				match[1] = match[1].replace(/(")/gmi, '');
				kg.items[pageID + 'Image'].content = { src: match[0], alt: match[1] };
			}
			getProduct(kg.vars.upc, function(product) {
				context.cache[cacheKey] = {
					items: kg.items,
					title: kg.seo.title,
					description: kg.seo.description,
					vars: kg.vars,
					product: product
				};
				render();
			});
		});
	});
};
