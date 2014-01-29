module.exports.set = function(context) {
	landing(context);
};

function landing(context) {
	context.app.get('/blog', function(req, res){
		res.render('blog', {
			layout : context.cache.layout
		});	
	})
}