var kitgui = require('kitgui');
var config = require('config');
var async = require('async');
//var parser = require('rssparser');
var _ = require('lodash');

var monthNameLookup = [
	'January', 'February', 'March', 'April', 'May', 'June',
	'July', 'August', 'September', 'October', 'November', 'December'
];

module.exports = {
	template1: template1,
	template2: template2,
	template3: template3,
	blog: blog,
	blogItem: blogItem,
	contact: contact,
	faq: faq,
	resourceLanding: resourceLanding,
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
				layout : Object.assign({},context.cache.layout),
				kitguiAccountKey : config.kitgui.accountKey,
				pageID : pageID,
				items : Object.assign({},kg.items),
				title : kg.seo.title,
				description : kg.seo.description,
				vars: Object.assign({},kg.vars)
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
				layout : Object.assign({},context.cache.layout),
				kitguiAccountKey : config.kitgui.accountKey,
				pageID : pageID,
				items : Object.assign({},kg.items),
				title : kg.seo.title,
				description : kg.seo.description,
				vars: Object.assign({},kg.vars)
			};
			render();
		});
	});
}

function template3(context, route, options) {
	context.app.get(route, function(req, res){
		var routeOK = false;
		var pageID = cleanURL(req.path);

		function render() {
			res.render('template3', context.cache[pageID]);
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
				{ id: pageID + 'Title', editorType: 'inline' },
				{ id: pageID + 'SubTitle', editorType: 'inline' },
				{ id: pageID + 'FlourishRight', editorType: 'image' },
				{ id: pageID + 'Image', editorType : 'bootstrap-carousel-json' },
				{ id: pageID + 'Content', editorType: 'html' },
				{ id: pageID + 'RightHeader', editorType: 'inline' },
				{ id: pageID + 'RightContent', editorType: 'html' }
			]
		}, function(kg){
			if (!routeOK && !kg.seo.title) {
				return res.redirect('/404');
			}

			options = options || {};
			if (!kg.items[pageID + 'FlourishRight'].content)
				kg.items[pageID + 'FlourishRight'].content = '<img src="/img/flourish2.png" alt="flourish">';
			else
				kg.items[pageID + 'FlourishRight'].content = kg.items[pageID + 'FlourishRight'].content.replace('http:', '');
			context.cache[pageID] = _.assign({}, options, {
				layout: Object.assign({},context.cache.layout),
				kitguiAccountKey: config.kitgui.accountKey,
				pageID: pageID,
				items: Object.assign({},kg.items),
				title: kg.seo.title,
				description: kg.seo.description,
				vars: Object.assign({},kg.vars)
			});
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
			var parts, urlMonth, urlYear;
			var category, categories;
			var obj, newObj, i, date, month, year,
			contentList = [], leastLength, blogItemKey = pageID + 'Blog';

			if (urlParts.length === 2) {
				parts = urlParts[1].split('-');
				if (parts.length === 1)
					category = decodeURIComponent(parts[0]);
				else if (parts.length === 2) {
					urlMonth = parts[0];
					urlYear = parts[1];
				}
			}

			obj = context.cache[pageID] || {};
			newObj = obj;

			// parse out right nav
			if (obj.items && obj.items[blogItemKey] && obj.items[blogItemKey].content) {
				json = obj.items[blogItemKey].content;
				if (obj.months) {
					months = obj.months;
				} else {
					months = getArchiveMonths(json);
					obj.months = months;
				}

				if (!obj.categories) {
					categories = {};
					json.forEach(function(item) {
						if (item.tags) {
							item.tags.forEach(function(tag) {
								if (!categories[tag])
									categories[tag] = 1;
								else
									categories[tag] = categories[tag] + 1;
							});
						}
					});
					obj.categories = categories;
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
				} else if (category) {
					json.forEach(function(item) {
						if (item.tags && item.tags.indexOf(category) > -1)
							contentList.push(item);
					});
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
				layout : Object.assign({}, context.cache.layout),
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
			context.cache[pageID].vars = Object.assign({},kg.vars);
			context.cache[pageID].items = Object.assign({},kg.items);
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
				layout: Object.assign({},context.cache.layout),
				kitguiAccountKey: config.kitgui.accountKey,
				pageID: pageID,
				items: Object.assign({},kg.items),
				title: kg.seo.title,
				description: kg.seo.description,
				vars: Object.assign({},kg.vars)
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
			layout : Object.assign({},context.cache.layout),
			kitguiAccountKey : config.kitgui.accountKey,
			pageID : pageID,
			url : 'http://' + config.domain + req.path
		};
		async.parallel([
			//function(callback) {
				//parser.parseURL('http://wcpm-blog.emeraldcode.com/rss/', {}, function(err, out){
				//	if (err) { return callback(); }
				//	context.cache[pageID].rss = out;
				//	callback();
			//	});
			//},
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
					context.cache[pageID].vars = Object.assign({},kg.vars);
					context.cache[pageID].items = Object.assign({},kg.items);
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
			//function(callback) {
				//parser.parseURL('http://wcpm-blog.emeraldcode.com/rss/', {}, function(err, out){
				//	if (err) { return callback(); }
			//		context.cache[pageID].rss = out;
			//		callback();
			//	});
			//},
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
					context.cache[pageID].vars = Object.assign({},kg.vars);
					context.cache[pageID].items = Object.assign({},kg.items);
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
	templateHelper(context, {
		route: route,
		template: 'template2',
		kitguiItems: kitguiItems
	});
}

function blogItem(context, route) {
	templateHelper(context, {
		route: route,
		template: 'blog_item',
		kitgui: [
			{ id: 'Title', editorType: 'inline' },
			{ id: 'SubTitle', editorType: 'inline' },
			{ id: 'Content', editorType: 'html' }
		],
		onRender: function(obj) {
			if (context.cache['-blog'] )
				return Object.assign({}, obj, {
					months: context.cache['-blog'].months,
					categories: context.cache['-blog'].categories
				});
			return obj || {};
		}
	});
}

function templateHelper(context, options) {
	options = _.assign({ verb: 'get', kitguiItems: [] }, options);
	context.app[options.verb](options.route, function(req, res){
		var routeOK = false;
		var pageID = cleanURL(req.path);

		function render() {
			var cache = context.cache[pageID] || {};
			if (options.onRender)
				cache = options.onRender(cache) || {}
			res.render(options.template, cache);
		}

		if (req.cookies.kitgui === '1' || req.query.refresh) {
			routeOK = true;
			delete context.cache[pageID];
		}

		if (context.cache[pageID]) {
			//console.log('has cache')
			return render();
		}
		var kitguiItems = _.cloneDeep(options.kitgui, true);
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
			console.log(pageID)
			context.cache[pageID] = _.assign({}, options, {
				layout: Object.assign({}, context.cache.layout),
				kitguiAccountKey: config.kitgui.accountKey,
				pageID: pageID,
				items: Object.assign({
					[pageID + 'Title']: '',
					[pageID + 'SubTitle']: '',
					[pageID + 'Content']: {}
				},kg.items),
				vars: Object.assign({},kg.vars),
				seo: kitgui.seo || {},
				title: kg.seo.title,
				description : kg.seo.description
			});
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
