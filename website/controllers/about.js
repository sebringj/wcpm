var kitgui = require('kitgui'),
config = require('config');

module.exports.set = function(context) {
	landing(context);
	contentPages(context);
};

function landing(context) {
	context.app.get('/about', function(req, res) {
		var cacheKey = 'about';
		function render() {
			res.render('about', {
				layout : context.cache.layout,
				kitguiAccountKey : config.kitgui.accountKey,
				pageID : 'about',
				items : context.cache.about.items,
				title : context.cache.about.title,
				description : context.cache.about.description
			});
		}
		if (req.cookies.kitgui) {
			delete context.cache.about;
		}
		if (context.cache.about) {
			render();
			return;
		}
		kitgui.getContents({
			basePath : config.kitgui.basePath,
			host : config.kitgui.host,
			items : [
				{ id : 'aboutRotator', editorType : 'bootstrap-rotator' },
				{ id : 'aboutB1H1', editorType : 'inline' },
				{ id : 'aboutB1Copy', editorType : 'html' },
				{ id : 'aboutB2C1H2', editorType : 'inline' },
				{ id : 'aboutB2C1Img', editorType : 'image' },
				{ id : 'aboutB2C1Copy', editorType : 'html' },
				{ id : 'aboutB2C2H2', editorType : 'inline' },
				{ id : 'aboutB2C2Img', editorType : 'image' },
				{ id : 'aboutB2C2Copy', editorType : 'html' },
				{ id : 'aboutB2C3H2', editorType : 'inline' },
				{ id : 'aboutB2C3Img', editorType : 'image' },
				{ id : 'aboutB2C3Copy', editorType : 'html' },
				{ id : 'aboutB3H2', editorType : 'inline' },
				{ id : 'aboutB3Img', editorType : 'image' },
				{ id : 'aboutB3Copy', editorType : 'html' }
			]
		}, function(kg){
			context.cache.about = {
				items : kg.items,
				title : kg.seo.title,
				description : kg.seo.description
			};
			render();
		});
	});
}

function contentPages(context) {
	context.app.get('/about/:id', function(req, res) {
		
	});
}

