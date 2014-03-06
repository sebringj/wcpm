var kitgui = require('kitgui'),
config = require('config');

module.exports.set = function(context){
	setLayoutCache(context);
};

function setLayoutCache(context) {
	context.app.use(function(req, res, next){
		if (req.cookies.kitgui) {
			delete context.cache.layout;
		}
		if (context.cache.layout) {
			console.log('layout cached');
			return next();
		}		
		kitgui.getContents({
			basePath : config.kitgui.basePath,
			host : config.kitgui.host,
			items : [
				{ id : 'homeNavItem1', editorType : 'inline' },
				{ id : 'homeNavItem2', editorType : 'inline' },
				{ id : 'homeNavItem3', editorType : 'inline' },
				{ id : 'homeNavItem4', editorType : 'inline' },
				{ id : 'homeNavItem5', editorType : 'inline' },
				{ id : 'homeNavItem6', editorType : 'inline' },
				{ id : 'homeNavItem7', editorType : 'inline' },
				{ id : 'layoutContactHeader', editorType : 'inline' },
				{ id : 'layoutContactText1', editorType : 'inline' },
				{ id : 'layoutContactRight1', editorType : 'inline' },
				{ id : 'layoutContactRight2', editorType : 'inline' }
			]
		}, function(kg){
			context.cache.layout = {
				items : kg.items
			};
			console.log(kg.items);
			next();
		});
	});
}