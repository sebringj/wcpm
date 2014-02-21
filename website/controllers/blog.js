var templateHelper = require('../lib/templateHelper.js');
module.exports.set = function(context) {
	templateHelper.blog(context,'/blog');
};