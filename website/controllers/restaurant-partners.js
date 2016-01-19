var config = require('config'),
kitgui = require('kitgui'),
templateHelper = require('../lib/templateHelper.js');

module.exports.set = function(context) {
	landing(context);
	templateHelper.template2(context,/-partner$/);
};

function landing(context) {
	context.app.get('/restaurant-hospitality-partners', function(req, res) {
		var cacheKey = 'restaurantHospitalityLanding';
		var pageID = cacheKey;
		function render() {
			res.render('restaurant-partners', {
				layout : context.cache.layout,
				kitguiAccountKey : config.kitgui.accountKey,
				pageID : pageID,
				items : context.cache[cacheKey].items,
				title : context.cache[cacheKey].title,
				description : context.cache[cacheKey].description,
				vars: context.cache[cacheKey].vars
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
			url : 'http://' + config.domain + req.path,
			items : [
				{ id : 'restaurantHospitalityRotator', editorType : 'bootstrap-carousel-json' },
				{ id : 'restaurantHospitalityTitle', editorType : 'inline' },
				{ id : 'restaurantHospitalityRestaurants', editorType : 'collection-json' },
				{ id : 'restaurantHospitalityHospitality', editorType : 'collection-json' }
			]
		}, function(kg){
			context.cache[cacheKey] = {
				items : kg.items,
				title : kg.seo.title,
				description : kg.seo.description,
				vars: kg.vars
			};
			render();
		});
	});
}
