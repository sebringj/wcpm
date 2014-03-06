var express = require('express'),
	config = require('config'),
	app = express(),
	port = (process.env.PORT || 3999),
	server = app.listen(port),
	controllers = require('./controllers'),
	http = require('http'),
	path = require('path'),
	cons = require('consolidate'),
	swig = require('swig'),
	middleware = require('./controllers/middleware.js'),
	context = {
		app : app,
		cache : {}
		//mailchimp : (new mcapi.Mailchimp(config.mailchimp.apikey))
	};
	
app.engine('.html', cons.swig);
app.set('view engine', 'html');
app.set('view cache', false);
app.set('views', __dirname + '/views');
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
middleware.set(context);
app.use(app.router);
app.use(express.favicon(__dirname + '/public/favicon.ico'));

controllers.set(context);
console.log('running on port ' + port);