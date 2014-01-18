var kitgui = require('../index.js'),
	assert = require('assert');
	
	kitgui.getContents({
		pageID : '-',
		host: 's3.amazonaws.com',
		basePath : '/kitgui/clients/d3f9de3896714860aa94d6b441376df4',
		items : [
			{ id : 'test', editorType : 'raw' },
			{ id : 'test2', editorType : 'html' }
		]
	}, function(json) {
		console.log(json);
		//assert.equal(json.seo.title, {}, 'SEO FAIL');
		//assert.equal(json.vars, {}, 'SEO FAIL');
	});

/*	
kitgui.getContents({
	pageID : '-dealer-',
	host: 's3.amazonaws.com',
	basePath : '/kitgui/clients/d3f9de3896714860aa94d6b441376df4',
}, function(json) {
	//assert.notEqual(json.vars.title, {}, 'SEO FAIL');
	console.log(json);
});
*/

