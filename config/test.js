module.exports = {

	// server listening port config
	port: process.env.PORT || 8080,

	// mongoDB connection url
	db_url: 'mongodb://localhost/KiwiAPI-test',

	// JWT private key
	private_key: 'kiwisupersecretprivatekey007-test',

	// express-session private secret key
	secret_session: 'kiwisupersessionsecret007-test'

};
