var templateHelper = require('../lib/templateHelper.js');

module.exports.set = function(context) {
	templateHelper.resourceLanding(context,'/resources');
	templateHelper.contact(context,'/resources/contact');
	templateHelper.faq(context,'/resources/frequently-asked-questions');
};