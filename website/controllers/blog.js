var templateHelper = require('../lib/templateHelper');
module.exports.set = function(context) {
	templateHelper.blog(context, /^\/blog(\/.+)?$/i);
	templateHelper.blogItem(context, /-blog$/);
};
