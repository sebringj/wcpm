module.exports.set = function(context) {
	landing(context);
};

function landing(context) {
	context.app.get('/restaurant-meat-service', function(req, res){
		res.render('restaurant-meat-service', {
			layout : context.cache.layout
		});	
	})
}