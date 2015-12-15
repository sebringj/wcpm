var kitguiAccountKey = process.env.KITGUI_ACCOUNT_KEY;
module.exports = {
  domain: process.env.DOMAIN,
  port: process.env.PORT,
  sslPort: process.env.SSL_PORT,
  kitgui: {
    host: 's3.amazonaws.com',
    basePath: '/kitgui/clients/' + kitguiAccountKey,
    accountKey: kitguiAccountKey
  },
  email: {
    user: process.env.EMAIL_USER,
    to: process.env.EMAIL_TO,
    pass: process.env.EMAIL_PASSWORD,
    from: process.env.EMAIL_FROM
  },
	glut: {
		api: process.env.GLUT_API
	}
}; // 216.31.162.187
