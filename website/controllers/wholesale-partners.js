var kitgui = require('kitgui'),
config = require('config'),
templateHelper = require('../lib/templateHelper.js');

module.exports.set = function(context) {
	landing(context);
	templateHelper.template1(context,/^\/[a-z0-9\-_]+-wholesale-partner$/);
};

function landing(context) {
	context.app.get('/wholesale-partners', function(req, res){
		res.render('wholesale-partners', {
			layout : context.cache.layout
		});	
	})
}