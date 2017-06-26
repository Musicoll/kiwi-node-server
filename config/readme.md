# Add your own config files

This project uses the [node-config](https://github.com/lorenwest/node-config) module to support multiple server configurations.  
You can add your own configuration file to this directory as explained [here](https://github.com/lorenwest/node-config/wiki/Configuration-Files).  

Ex:

```js
module.exports = {

	// server listening port config
	port: process.env.PORT || 8080,

	// mongoDB connection url
	db_url: 'mongodb://localhost/YourDataBase',

	// JWT private key
	private_key: 'yoursupersecretprivatekey',

	// express-session private secret key
	secret_session: 'yoursupersessionsecret'

};
```
