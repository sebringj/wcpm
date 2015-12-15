var express = require('express');
var config = require('config');
var app = express();
var controllers = require('./controllers');
var path = require('path');
var	cons = require('consolidate');
var swig = require('swig');
var middleware = require('./controllers/middleware.js');
var context = {
	app: app,
	cache: {}
};
var http = require('http');
var https = require('https');
var fs = require('fs');

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

http.createServer(app).listen(process.env.PORT);
if (process.env.SSL_PORT)
  https.createServer({
    key: fs.readFileSync(process.env.SSL_KEY),
    cert: fs.readFileSync(process.env.SSL_CERT)
  }, app).listen(process.env.SSL_PORT);
