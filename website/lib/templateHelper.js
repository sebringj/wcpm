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
			delete context.cache[pageID];
		}
		if (context.cache[pageID]) {
			return render();
		}
		kitgui.getContents({
			basePath : config.kitgui.basePath,
			host : config.kitgui.host,
			pageID : pageID,
			items : [
				{ id : pageID + 'Rotator', editorType : 'bootstrap-carousel-json' },
				{ id : pageID + 'Title', editorType : 'inline' },
				{ id : pageID + 'Image', editorType : 'bootstrap-carousel-json' },
				{ id : pageID + 'Content', editorType : 'html' },
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

function template2(context, route) {
	context.app.get(route, function(req, res){
		var routeOK = false;
		var pageID = cleanURL(req.path);
		
		function render() {
			res.render('template2', context.cache[pageID]);
		}
		if (req.cookies.kitgui === '1') {
			routeOK = true;
			delete context.cache[pageID];
		}
		if (context.cache[pageID]) {
			return render();
		}
		kitgui.getContents({
			basePath : config.kitgui.basePath,
			host : config.kitgui.host,
			pageID : pageID,
			items : [
				{ id : pageID + 'Rotator', editorType : 'bootstrap-carousel-json' },
				{ id : pageID + 'Title', editorType : 'inline' },
				{ id : pageID + 'Image', editorType : 'bootstrap-carousel-json' },
				{ id : pageID + 'Gallery', editorType : 'bootstrap-carousel-json' },
				{ id : pageID + 'Content', editorType : 'html' },
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