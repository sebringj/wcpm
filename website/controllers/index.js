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
	
	// error pages
	context.app.use(function(req, res, next) {
		res.status(404);
		if (req.accepts('html')) {
			res.render('404', {
				title : '404',
				description: 'The page you requested could not be found',
				pageID : '404',
				url : 'http://' + config.domain + req.path,
				kitguiAccountKey : config.kitgui.accountKey,
				layout : context.cache.layout
			});
			return;
		}
		// respond with json
		if (req.accepts('json')) {
			res.send({ error: 'Not found' });
			return;
		}
		// default to plain-text. send()
		res.type('txt').send('Not found');
	});
	
	context.app.use(function(err, req, res, next){
		res.status(err.status || 500);
		console.log(err);
		res.render('500', { 
			error: err,
			pageID : '404',
			kitguiAccountKey : config.kitgui.accountKey,
			layout : context.cache.layout
		});
	});
};

function home(context) {
	context.app.get('/', function(req, res) {
		var cacheKey = 'home';
		var pageID = 'home';
		function render() {
			res.render('index', {
				layout : context.cache.layout,
				kitguiAccountKey : config.kitgui.accountKey,
				pageID : pageID,
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
			pageID : pageID,
			url : 'http://' + config.domain + req.path,
			items : [
				{ id : 'homeSlider', editorType : 'bootstrap-carousel-json' },
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