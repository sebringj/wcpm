var kitguiAccountKey = process.env.KITGUI_ACCOUNT_KEY;
module.exports = {
  doLocal: process.env.DO_LOCAL,
  domain: process.env.DOMAIN,
  port: process.env.PORT,
  sslPort: process.env.SSL_PORT,
  sslKey: process.env.SSL_KEY,
  sslCert: process.env.SSL_CERT,
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
	},
  letsEncrypt: {
    domains: (process.env.LETSENCRYPT_DOMAINS || '').split(','),
    email: process.env.LETSENCRYPT_EMAIL,
  },
}; // 216.31.162.187
