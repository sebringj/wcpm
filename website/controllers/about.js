var kitgui = require('kitgui'),
config = require('config'),
templateHelper = require('../lib/templateHelper.js');

module.exports.set = function(context) {
	landing(context);
	templateHelper.template1(context,/\/about\/[a-z0-9_\-]+$/);
};

function landing(context) {
	context.app.get('/about', function(req, res) {
		var cacheKey = 'about';
		var pageID = cacheKey;
		function render() {
			res.render('about', {
				layout : context.cache.layout,
				kitguiAccountKey : config.kitgui.accountKey,
				url : 'http://' + config.domain + req.path,
				pageID : pageID,
				items : context.cache.about.items,
				title : context.cache.about.title,
				description : context.cache.about.description,
				vars: context.cache.about.vars
			});
		}
		if (req.cookies.kitgui) {
			delete context.cache.about;
		}
		if (context.cache.about) {
			return render();
		}
		kitgui.getContents({
			basePath : config.kitgui.basePath,
			host : config.kitgui.host,
			pageID : pageID,
			items : [
				{ id : 'aboutRotator', editorType : 'bootstrap-carousel-json' },
				{ id : 'aboutB1H1', editorType : 'inline' },
				{ id : 'aboutB1Copy', editorType : 'html' },
				{ id : 'aboutB2C1H2', editorType : 'inline' },
				{ id : 'aboutB2C1Image', editorType : 'image' },
				{ id : 'aboutB2C1Copy', editorType : 'html' },
				{ id : 'aboutB2C2H2', editorType : 'inline' },
				{ id : 'aboutB2C2Img', editorType : 'image' },
				{ id : 'aboutB2C2Copy', editorType : 'html' },
				{ id : 'aboutB2C3H2', editorType : 'inline' },
				{ id : 'aboutB2C3Img', editorType : 'image' },
				{ id : 'aboutB2C3Copy', editorType : 'html' },
				{ id : 'aboutB3H2', editorType : 'inline' },
				{ id : 'aboutB3Img', editorType : 'image' },
				{ id : 'aboutB3Copy', editorType : 'html' },
				{ id : 'resourcesRotator', editorType : 'bootstrap-carousel-json' },
				{ id : 'resourcesTitle', editorType : 'inline' },
				{ id : 'resourcesMainContent', editorType : 'html' },
				{ id : 'resourcesH21', editorType : 'inline' },
				{ id : 'resourcesCatContent1', editorType : 'html' },
				{ id : 'resourcesH22', editorType : 'inline' },
				{ id : 'resourcesCatContent2', editorType : 'html' }
			]
		}, function(kg){
			context.cache.about = {
				items : Object.assign({},kg.items),
				title : kg.seo.title,
				description : kg.seo.description,
				vars: Object.assign({},kg.vars)
			};
			render();
		});
	});
}
