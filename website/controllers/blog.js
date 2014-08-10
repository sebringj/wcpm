var templateHelper = require('../lib/templateHelper.js');
module.exports.set = function(context) {
	templateHelper.blog(context,/^\/blog(\/[a-z]{3,25}-[0-9]{4})?$/i);
};