var config = require('config'),
nodemailer = require('nodemailer'),
path = require('path'),
emailRE = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;

function sendEmail(options, callback) {
	var gmailTransport = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: config.email.user,
			pass: config.email.pass
		}
	});
	
	// send mail with defined transport object
	gmailTransport.sendMail({
		from: options.fromEmail,
		to: config.email.to,
		subject: 'website inquiry',
		html: '<a href="mailto:'+ options.fromEmail +'">' +
		'&quot;' + options.fromName + '&quot; ' + 
		'&lt;'+ options.fromEmail +'&gt;</a> ' +
			  'wrote:<br><br>' + options.message
	}, function(error, response){
		if (!options.subject || options.html) {
			callback({
				success : false,
				message : 'subject and html are required'
			});
			return;		
		}
		if (callback) { 
		    if(error) {
		        callback({
					err : 'error',
					error : error,
					response : response
				});
		    } else {
				callback({
					success : true,
					message : 'ok'
				});
		    }
		}
		smtpTransport.close();
	});
};

module.exports.set = function(app) {
	app.post('/data/send-email', function(req, res) {
		sendEmail({
			fromEmail: req.body.email,
			fromName: req.body.name,
			message: req.body.message
		}, function(){
			res.json({msg: 'ok'});
		});
	});
};

