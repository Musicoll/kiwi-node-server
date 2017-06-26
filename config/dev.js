module.exports = {

	// server listening port config
	port: process.env.PORT || 8080,

	// mongoDB connection url
	db_url: 'mongodb://localhost/KiwiAPI',

	// JWT private key
	private_key: 'kiwisupersecretprivatekey007-dev',

	// express-session private secret key
	secret_session: "kiwisupersessionsecret007-dev"

};
