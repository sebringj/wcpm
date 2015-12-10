var kitguiAccountKey = 'a009f65654d241638cbb908f41f03f9b';
module.exports = {
  domain: 'www.westcoastprimemeats.com',
  kitgui: {
    host: 's3.amazonaws.com',
    basePath: '/kitgui/clients/' + kitguiAccountKey,
    accountKey: kitguiAccountKey
  },
  email: {
    user: 'noreply@emeraldcode.com',
    to: 'webinfo@westcoastprimemeats.com',
    pass: process.env.EMAIL_PASSWORD,
    from: 'noreply@emeraldcode.com'
  },
	glut: {
		url: 'http://api.glut.io/api'
	}
}; // 216.31.162.187
