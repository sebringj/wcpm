module.exports.set = function(context) {
	landing(context);
};

function landing(context) {
	context.app.get('/about', function(req, res){
		res.render('about', {
			layout : context.cache.layout
		});	
	})
}