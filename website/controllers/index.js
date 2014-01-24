var config = require('config'),
utils = require('../lib/utils.js'),
kitgui = require('kitgui'),
restaurantMeatServiceRoutes = require('./restaurant-meat-service.js'),
restaurantPartnersRoutes = require('./restaurant-partners.js'),
wholesalePartnersRoutes = require('./wholesale-partners.js'),
blogRoutes = require('./blog.js'),
aboutRoutes = require('./about.js'),
resourcesRoutes = require('./resources.js');

module.exports.set = function(context) {
	home(context);
	restaurantMeatServiceRoutes.set(context);
	restaurantPartnersRoutes.set(context);
	wholesalePartnersRoutes.set(context);
	blogRoutes.set(context);
	aboutRoutes.set(context);
	resourcesRoutes.set(context);
};

function home(context) {
	context.app.get('/', function(req, res) {
		var cacheKey = 'home';
		function render() {
			res.render('index', {
				layout : context.cache.layout,
				kitguiAccountKey : config.kitgui.accountKey,
				pageID : 'home',
				items : context.cache.home.items,
				title : context.cache.home.title,
				description : context.cache.home.description
			});
		}
		if (req.cookies.kitgui) {
			delete context.cache.home;
		}
		if (context.cache.home) {
			render();
			return;
		}
		kitgui.getContents({
			basePath : config.kitgui.basePath,
			host : config.kitgui.host,
			items : [
				{ id : 'homeSlogan', editorType : 'inline' },
				{ id : 'homeBlurb1', editorType : 'html' },
				{ id : 'homeLearnMore', editorType : 'inline' },
				{ id : 'homeProductsHeader', editorType : 'inline' },
				{ id : 'homeProductsText', editorType : 'inline' },
				{ id : 'homeRestaurantsHeader', editorType : 'inline' },
				{ id : 'homeRestaurantsText', editorType : 'inline' },
				{ id : 'homeTeamHeader', editorType : 'inline' },
				{ id : 'homeTeamText', editorType : 'inline' },
				{ id : 'homePartnersHeader', editorType : 'inline' },
			]
		}, function(kg){
			context.cache.home = {
				items : kg.items,
				title : kg.seo.title,
				description : kg.seo.description
			};
			render();
		});
	});
}