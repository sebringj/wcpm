var kitgui = require('kitgui'),
config = require('config');

module.exports = {
	template1 : template1
};

function template1(context, route) {
	context.app.get(route, function(req, res){
		var routeOK = false;
		var pageID = cleanURL(req.path);
		
		function render() {
			res.render('template1', context.cache[pageID]);
		}
		if (req.cookies.kitgui === '1') {
			routeOK = true;
		}
		if (context.cache[pageID]) {
			return render();
		}
		kitgui.getContents({
			basePath : config.kitgui.basePath,
			host : config.kitgui.host,
			pageID : pageID,
			items : [
				{ id : pageID + 'Banner', editorType : 'image' },
				{ id : pageID + 'H1', editorType : 'inline' },
				{ id : pageID + 'ContentImage', editorType : 'image' },
				{ id : pageID + 'MainContent', editorType : 'html' },
				{ id : pageID + 'RightHeader', editorType : 'inline' },
				{ id : pageID + 'RightContent', editorType : 'html' }
			]
		}, function(kg){
			if (!routeOK && !kg.seo.title) {
				return res.redirect('/404');
			}
			context.cache[pageID] = {
				layout : context.cache.layout,
				kitguiAccountKey : config.kitgui.accountKey,
				pageID : pageID,
				items : kg.items,
				title : kg.seo.title,
				description : kg.seo.description
			};
			render();
		});
	});
}


function cleanURL(str) {
	return str.replace(/[^a-z0-9_\-]/gi,'-').replace(/_+/gi,'-');
}