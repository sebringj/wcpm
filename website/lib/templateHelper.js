var kitgui = require('kitgui'),
config = require('config'),
async = require('async'),
parser = require('rssparser');

var monthNameLookup = [
	'January', 'February', 'March', 'April', 'May', 'June', 
	'July', 'August', 'September', 'October', 'November', 'December'
];

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
			url : 'http://' + config.domain + req.path,
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
			url : 'http://' + config.domain + req.path,
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
		var pageID = '-blog'
			
		function render() {
			
			var json;
			var months = [];
			var content;
			var urlParts = req.url.substr(1).split('/');
			var dateParts, urlMonth, urlYear;
			var obj, newObj, i, date, month, year, 
			contentList = [], leastLength, blogItemKey = pageID + 'Blog';
			
			if (urlParts.length === 2) {
				dateParts = urlParts[1].split('-');
				urlMonth = dateParts[0];
				urlYear = dateParts[1];
			}
			
			obj = context.cache[pageID];
			newObj = obj;
			
			// get month objects for archive output
			if (obj.items && obj.items[blogItemKey] && obj.items[blogItemKey].content) {
				json = obj.items[blogItemKey].content;
				if (obj.months) {
					months = obj.months;
				} else {
					months = getArchiveMonths(json);
					obj.months = months;
				}


				// if we have a filter defined then remove out entries that are not in the filter
				if (urlMonth) {
					for(i = 0; i < json.length; i++) {
						date = new Date(json[i].date);
						month = monthNameLookup[date.getMonth()];
						year = date.getFullYear()+'';
						if (urlMonth === month && urlYear === year) {
							contentList.push(json[i]);
						}
					}
				} else { // otherwise we limit the results to 20
					leastLength = (json.length < 20) ? json.length : 20;
					for(i = 0; i < leastLength; i++) {
						contentList.push(json[i]);
					}
				}

				// create new object but do not copy items
				newObj = {};
				for (i in obj) {
					if (i !== 'items') {
						newObj[i] = obj[i];
					}
				}
				
				newObj.items = {};
				// now only copy items that are not in blogItemKey
				for(i in obj.items) {
					if (i !== blogItemKey) {
						newObj.items[i] = obj.items[i];
					}
				}
				newObj.items[blogItemKey] = {
					classNames : obj.items[blogItemKey].classNames,
					content: contentList
				};
			}
			
			res.render('blog', newObj);
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
		if (pageID) {
			context.cache[pageID] = {
				layout : context.cache.layout,
				kitguiAccountKey : config.kitgui.accountKey,
				pageID : pageID
			};	
		}
		kitgui.getContents({
			basePath: config.kitgui.basePath,
			host: config.kitgui.host,
			pageID: pageID,
			url: 'http://' + config.domain + req.path,
			items: [
				{ id: pageID + 'Rotator', editorType: 'bootstrap-carousel-json' },
				{ id: pageID + 'Title', editorType: 'inline' },
				{ id: pageID + 'Blog', editorType: 'blog-json' }
			]
		}, function(kg) {
			if (!routeOK && !kg.seo.title) {
				return res.redirect('/404');
			}
			context.cache[pageID].items = kg.items;
			context.cache[pageID].title = kg.seo.title;
			context.cache[pageID].description = kg.seo.description;			
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
			url : 'http://' + config.domain + req.path,
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
			if (kg.items)
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
			res.render('faq', context.cache[pageID]);
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
			pageID : pageID,
			url : 'http://' + config.domain + req.path
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
						{ id : pageID + 'Title', editorType : 'inline' },
						{ id : pageID + 'Content', editorType : 'html' },
						{ id : pageID + 'FAQ', editorType : 'faq-json' }
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
			res.render('contact', context.cache[pageID]);
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
			pageID : pageID,
			url : 'http://' + config.domain + req.path
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
						{ id : pageID + 'Title', editorType : 'inline' },
						{ id : pageID + 'MainContent', editorType : 'html' },
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

function getArchiveMonths(arr) {
	var date, month, year, key, monthsLookup = {};
	var months = [];
	for(var i = 0; i < arr.length; i++) {
		date = new Date(arr[i].date);
		month = monthNameLookup[date.getMonth()];
		year = date.getFullYear()+'';
		key = month + '-' + year;
		if (!monthsLookup[key]) {
			monthsLookup[key] = true;
			months.push({ month: month, year: year});
		}
	}
	return months;
}