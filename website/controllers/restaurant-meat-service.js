var config = require('config'),
kitgui = require('kitgui');

module.exports.set = function(context) {
	landing(context);
};

function landing(context) {
	context.app.get('/restaurant-hospitality-meat-service', function(req, res) {
		var cacheKey = 'meatServiceLanding';
		var pageID = cacheKey;
		function render() {
			res.render('restaurant-meat-service', {
				layout : context.cache.layout,
				kitguiAccountKey : config.kitgui.accountKey,
				pageID : pageID,
				items : context.cache[cacheKey].items,
				title : context.cache[cacheKey].title,
				description : context.cache[cacheKey].description
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
			basePath : config.kitgui.basePath,
			host : config.kitgui.host,
			pageID : pageID,
			items : [
				{ id : 'meatServiceLandingRotator', editorType : 'bootstrap-carousel-json' },
				{ id : 'meatServiceLandingTitle', editorType : 'inline' },
				{ id : 'meatServiceLandingTopText', editorType : 'html' },
				{ id : 'meatServiceLandingCollection', editorType : 'collection-json' }
			]
		}, function(kg){
			context.cache[cacheKey] = {
				items : kg.items,
				title : kg.seo.title,
				description : kg.seo.description
			};
			render();
		});
	});
}