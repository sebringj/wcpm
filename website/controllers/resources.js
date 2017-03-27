var templateHelper = require('../lib/templateHelper.js');

module.exports.set = function(context) {
	templateHelper.contact(context,'/contact');
	templateHelper.faq(context,'/about/frequently-asked-questions');
};
