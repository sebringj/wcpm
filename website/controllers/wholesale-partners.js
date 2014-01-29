module.exports.set = function(context) {
	landing(context);
};

function landing(context) {
	context.app.get('/wholesale-partners', function(req, res){
		res.render('wholesale-partners', {
			layout : context.cache.layout
		});	
	})
}