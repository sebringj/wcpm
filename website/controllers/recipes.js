var config = require('config'),
kitgui = require('kitgui'),
templateHelper = require('../lib/templateHelper.js');

module.exports.set = function(context) {
	landing(context);
	templateHelper.template3(context, /-recipe$/, {
		styles: ['/css/recipe.css']
	});
};

function landing(context) {
	context.app.get('/recipes', function(req, res) {
		var cacheKey = 'recipes';
		var pageID = cacheKey;
		function render() {
			res.render('recipes', {
				layout: Object.assign({}, context.cache.layout),
				kitguiAccountKey: config.kitgui.accountKey,
				pageID: pageID,
				items: Object.assign({}, context.cache[cacheKey].items),
				title: context.cache[cacheKey].title,
				description: context.cache[cacheKey].description,
				vars: Object.assign({}, context.cache[cacheKey].vars)
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
				{ id: 'recipesRotator', editorType: 'bootstrap-carousel-json' },
				{ id: 'recipesTitle', editorType: 'inline' },
				{ id: 'recipesSubTitle', editorType: 'inline' },
				{ id: 'recipesList', editorType: 'collection-json' }
			]
		}, function(kg){
			context.cache[cacheKey] = {
				items: kg.items,
				title: kg.seo.title,
				description: kg.seo.description,
				vars: kg.vars
			};
			render();
		});
	});
}
