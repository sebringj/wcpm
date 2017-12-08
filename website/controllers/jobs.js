var config = require('config'),
kitgui = require('kitgui'),
templateHelper = require('../lib/templateHelper.js');

module.exports.set = function(context) {
	landing(context);
	templateHelper.template1(context,/-job$/);
};

function landing(context) {
	context.app.get('/jobs', function(req, res) {
		var cacheKey = 'job';
		var pageID = cacheKey;
		function render() {
			res.render('generic', {
				layout: Object.assign({},context.cache.layout),
				kitguiAccountKey: config.kitgui.accountKey,
				pageID: pageID,
				items: Object.assign({},context.cache[cacheKey].items),
				title: context.cache[cacheKey].title,
				description: context.cache[cacheKey].description,
				vars: Object.assign({},context.cache[cacheKey].vars)
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
				{ id : pageID + 'Title', editorType : 'inline' },
				{ id : pageID + 'HTML', editorType : 'html' }
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
