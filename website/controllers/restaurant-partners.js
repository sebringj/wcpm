module.exports.set = function(context) {
	landing(context);
};

function landing(context) {
	context.app.get('/restaurant-partners', function(req, res){
		res.render('restaurant-partners', {
			layout : context.cache.layout
		});	
	})
}