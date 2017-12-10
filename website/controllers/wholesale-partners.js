var config = require('config'),
kitgui = require('kitgui'),
templateHelper = require('../lib/templateHelper.js');

module.exports.set = function(context) {
	landing(context);
	templateHelper.template2(context,/-distributer$/);
};

function landing(context) {
	context.app.get('/wholesale-partners', function(req, res) {
		var cacheKey = 'wholesaleLanding';
		var pageID = cacheKey;
		function render() {
			res.render('wholesale-partners', {
				layout : Object.assign({},context.cache.layout),
				kitguiAccountKey : config.kitgui.accountKey,
				pageID : pageID,
				items : Object.assign({},context.cache[cacheKey].items),
				title : context.cache[cacheKey].title,
				description : context.cache[cacheKey].description,
				vars : Object.assign({},context.cache[cacheKey].vars)
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
				{ id : pageID + 'Rotator', editorType : 'bootstrap-carousel-json' },
				{ id : pageID + 'Title', editorType : 'inline' },
				{ id : pageID + 'Partners', editorType : 'collection-json' }
			]
		}, function(kg){
			context.cache[cacheKey] = {
				items : Object.assign({}, kg.items),
				title : kg.seo.title,
				description : kg.seo.description,
				vars: Object.assign({}, kg.vars)
			};
			render();
		});
	});
}
