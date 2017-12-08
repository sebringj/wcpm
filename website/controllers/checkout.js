var config = require('config');
var kitgui = require('kitgui');
var request = require('request');

module.exports.set = function(context) {

	context.app.get('/checkout', function(req, res) {

		var cacheKey = 'checkout-page';
		var pageID = cacheKey;

		function render() {
			res.render('checkout', {
				layout: Object.assign({},context.cache.layout),
				kitguiAccountKey: config.kitgui.accountKey,
				pageID: cacheKey,
				items: Object.assign({},context.cache[cacheKey].items),
				title: context.cache[cacheKey].title,
				vars: Object.assign({},context.cache[cacheKey].vars) || {},
				years: Object.assign({},context.cache[cacheKey].years)
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
			var years = []; var year = (new Date()).getFullYear();
			for(var i = 0; i < 10; i++) {
				years.push(year+i);
			}
			context.cache[cacheKey] = {
				items: kg.items,
				title: kg.seo.title,
				vars: kg.vars,
				years: years
			};
			render();
		});
	});
};
