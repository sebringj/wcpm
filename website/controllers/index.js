var config = require('config');
var utils = require('../lib/utils');
var kitgui = require('kitgui');
var restaurantMeatServiceRoutes = require('./restaurant-meat-service');
var restaurantPartnersRoutes = require('./restaurant-partners');
var wholesalePartnersRoutes = require('./wholesale-partners');
var blogRoutes = require('./blog');
var aboutRoutes = require('./about');
var resourcesRoutes = require('./resources');
var jobRoutes = require('./jobs');
var emailRoutes = require('./emails');
var productRoutes = require('./product');
var cartRoute = require('./cart');

var redirects = [
	{match: /^\/our_team\.htm$/i, redirect: '/about/our-cutting-team'},
	{match: /^\/Cut_of_the_week.htm$/i, redirect: '/restaurant-hospitality-meat-service'},
	{match: /^\/our_products.htm$/i, redirect: '/restaurant-hospitality-meat-service'},
	{match: /^\/dry_aging.htm$/i, redirect: '/dry-aged-beef-supplier'},
	{match: /^\/what_sets_us_apart.htm$/i, redirect: '/about'},
	{match: /^\/contact_us.htm$/i, redirect: '/resources/contact'}
];

module.exports.set = function(context) {
	// redirects
	var app = context.app;

	redirects.forEach(function(item){
		app.get(item.match, function(req, res){
			res.redirect(301, item.redirect);
		});
	});

	home(context);
	restaurantMeatServiceRoutes.set(context);
	restaurantPartnersRoutes.set(context);
	wholesalePartnersRoutes.set(context);
	blogRoutes.set(context);
	aboutRoutes.set(context);
	resourcesRoutes.set(context);
	jobRoutes.set(context);
	emailRoutes.set(context.app);
	productRoutes.set(context);
	cartRoute.set(context);

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
				{ id : 'homePartners', editorType : 'collection-json' }
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
