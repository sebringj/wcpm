module.exports.set = function(context) {
	landing(context);
};

function landing(context) {
	context.app.get('/resources', function(req, res){
		res.render('resources', {
			layout : context.cache.layout
		});	
	})
}