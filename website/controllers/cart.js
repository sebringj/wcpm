var config = require('config');
var kitgui = require('kitgui');
var request = require('request');

module.exports.set = function(context) {

	context.app.get('/cart', function(req, res) {

		var cacheKey = 'cart-page';
		var pageID = cacheKey;

		function render() {
			res.render('cart', {
				layout: context.cache.layout,
				kitguiAccountKey: config.kitgui.accountKey,
				pageID: cacheKey,
				items: context.cache[cacheKey].items,
				title: context.cache[cacheKey].title,
				vars: context.cache[cacheKey].vars || {}
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
				{ id: pageID + 'Title', editorType: 'inline' }
			]
		}, function(kg) {
			context.cache[cacheKey] = {
				items: kg.items,
				title: kg.seo.title,
				vars: kg.vars
			};
			render();
		});
	});
};
