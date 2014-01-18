module.exports.set = function(context) {
	var app = context.app;
	app.get('/',home);
};

function home(req, res) {
	res.render('index', {
		
	});
}