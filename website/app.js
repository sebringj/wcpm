require('dotenv').config()

const express = require('express');
const config = require('config');
const app = express();
const controllers = require('./controllers');
const path = require('path');
const	cons = require('consolidate');
const swig = require('swig');
const middleware = require('./controllers/middleware.js');
const context = {
	app: app,
	cache: {}
};
const http = require('http');
const https = require('https');
const fs = require('fs');

const lex = require('greenlock-express').create({
  server: 'production',
  email: config.letsEncrypt.email,
  agreeTos: true,
  approveDomains: config.letsEncrypt.domains
});

app.engine('.html', cons.swig);
app.set('view engine', 'html');
app.set('view cache', false);
app.set('views', __dirname + '/views');
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('body-parser').json());
app.use(require('method-override')());
app.use(express.static(path.join(__dirname, 'public')));
middleware.set(context);
app.use(require('express-favicon')(__dirname + '/public/favicon.ico'));
controllers.set(context);

if (config.doLocal)
  require('http').createServer(app).listen(config.port, function() {
    console.log('listening on port ' + this.address().port);
  });
else {
  require('http').createServer(app).listen(80, function () {
    console.log('Listening for ACME http-01 challenges on', this.address());
  });
  require('https').createServer(lex.httpsOptions, lex.middleware(app)).listen(443, function () {
    console.log('Listening for ACME tls-sni-01 challenges and serve app on', this.address());
  });
}
