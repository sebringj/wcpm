var kitgui = require('kitgui'),
config = require('config'),
async = require('async'),
parser = require('rssparser');

module.exports = {
	template1 : template1,
	template2 : template2,
	blog: blog,
	contact : contact,
	faq : faq,
	resourceLanding : resourceLanding
};

function template1(context, route) {
	context.app.get(route, function(req, res){
		var routeOK = false;
		var pageID = cleanURL(req.path);
		
		function render() {
			res.render('template1', context.cache[pageID]);
		}
		if (req.cookies.kitgui === '1' || req.query.refresh) {
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
		if (req.cookies.kitgui === '1' || req.query.refresh) {
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

function blog(context, route) {
	context.app.get(route, function(req, res){
		var routeOK = false;
		var pageID = cleanURL(req.path);
		
		function render() {
			res.render('blog', context.cache[pageID]);
		}
		if (req.cookies.kitgui === '1' || req.query.refresh) {
			routeOK = true;
			delete context.cache[pageID];
		}
		if (context.cache[pageID]) {
			return render();
		}
		context.cache[pageID] = {
			layout : context.cache.layout,
			kitguiAccountKey : config.kitgui.accountKey,
			pageID : pageID
		};
		async.parallel([
			function(callback) {
				parser.parseURL('http://wcpm-blog.emeraldcode.com/rss/', {}, function(err, out){
					if (err) { return callback(); }
					context.cache[pageID].rss = out;
					console.log(out);
					callback();
				});
			},
			function(callback) {
				kitgui.getContents({
					basePath : config.kitgui.basePath,
					host : config.kitgui.host,
					pageID : pageID,
					items : [
						{ id : pageID + 'Rotator', editorType : 'bootstrap-carousel-json' },
						{ id : pageID + 'Title', editorType : 'inline' }
					]
				}, function(kg){
					if (!routeOK && !kg.seo.title) {
						return res.redirect('/404');
					}
					context.cache[pageID].items = kg.items;
					context.cache[pageID].title = kg.seo.title;
					context.cache[pageID].description = kg.seo.description;
					callback();
				});
			}
		], function(){
			render();
		});
	});
}

function resourceLanding(context, route) {
	context.app.get(route, function(req, res){
		var routeOK = false;
		var pageID = cleanURL(req.path);
		
		function render() {
			res.render('resources', context.cache[pageID]);
		}
		if (req.cookies.kitgui === '1' || req.query.refresh) {
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
				{ id : pageID + 'MainContent', editorType : 'html' },
				{ id : pageID + 'H21', editorType : 'inline' },
				{ id : pageID + 'CatContent1', editorType : 'html' },
				{ id : pageID + 'H22', editorType : 'inline' },
				{ id : pageID + 'CatContent2', editorType : 'html' }
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

function faq(context, route) {
	context.app.get(route, function(req, res){
		var routeOK = false;
		var pageID = cleanURL(req.path);
		
		function render() {
			res.render('template1', context.cache[pageID]);
		}
		if (req.cookies.kitgui === '1' || req.query.refresh) {
			routeOK = true;
			delete context.cache[pageID];
		}
		if (context.cache[pageID]) {
			return render();
		}
		context.cache[pageID] = {
			layout : context.cache.layout,
			kitguiAccountKey : config.kitgui.accountKey,
			pageID : pageID
		};
		async.parallel([
			function(callback) {
				parser.parseURL('http://wcpm-blog.emeraldcode.com/rss/', {}, function(err, out){
					if (err) { return callback(); }
					context.cache[pageID].rss = out;
					console.log(out);
					callback();
				});
			},
			function(callback) {
				kitgui.getContents({
					basePath : config.kitgui.basePath,
					host : config.kitgui.host,
					pageID : pageID,
					items : [
						{ id : pageID + 'Rotator', editorType : 'bootstrap-carousel-json' },
						{ id : pageID + 'Title', editorType : 'inline' }
					]
				}, function(kg){
					if (!routeOK && !kg.seo.title) {
						return res.redirect('/404');
					}
					context.cache[pageID].items = kg.items;
					context.cache[pageID].title = kg.seo.title;
					context.cache[pageID].description = kg.seo.description;
					callback();
				});
			}
		], function(){
			render();
		});
	});
}

function contact(context, route) {
	context.app.get(route, function(req, res){
		var routeOK = false;
		var pageID = cleanURL(req.path);
		
		function render() {
			res.render('template1', context.cache[pageID]);
		}
		if (req.cookies.kitgui === '1' || req.query.refresh) {
			routeOK = true;
			delete context.cache[pageID];
		}
		if (context.cache[pageID]) {
			return render();
		}
		context.cache[pageID] = {
			layout : context.cache.layout,
			kitguiAccountKey : config.kitgui.accountKey,
			pageID : pageID
		};
		async.parallel([
			function(callback) {
				parser.parseURL('http://wcpm-blog.emeraldcode.com/rss/', {}, function(err, out){
					if (err) { return callback(); }
					context.cache[pageID].rss = out;
					console.log(out);
					callback();
				});
			},
			function(callback) {
				kitgui.getContents({
					basePath : config.kitgui.basePath,
					host : config.kitgui.host,
					pageID : pageID,
					items : [
						{ id : pageID + 'Rotator', editorType : 'bootstrap-carousel-json' },
						{ id : pageID + 'Title', editorType : 'inline' }
					]
				}, function(kg){
					if (!routeOK && !kg.seo.title) {
						return res.redirect('/404');
					}
					context.cache[pageID].items = kg.items;
					context.cache[pageID].title = kg.seo.title;
					context.cache[pageID].description = kg.seo.description;
					callback();
				});
			}
		], function(){
			render();
		});
	});
}

function template(context, route, kitguiItems) {
	context.app.get(route, function(req, res){
		var routeOK = false;
		var pageID = cleanURL(req.path);
		
		function render() {
			res.render('template2', context.cache[pageID]);
		}
		if (req.cookies.kitgui === '1' || req.query.refresh) {
			routeOK = true;
			delete context.cache[pageID];
		}
		if (context.cache[pageID]) {
			return render();
		}
		for(var i = 0; i < kitguiItems.length; i++) {
			kitguiItems[i].id = pageID + kitguiItems[i].id;
		}
		kitgui.getContents({
			basePath : config.kitgui.basePath,
			host : config.kitgui.host,
			pageID : pageID,
			items : kitguiItems
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