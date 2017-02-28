# Private config

You will need to create a file named `config.js` here to make the server to run with your own config variables.

```js
module.exports = {

	// server listening port config
	'port': process.env.PORT || 8080,

	// mongoDB connection url
	'db_url': 'mongodb://localhost/YourDataBase',

	// JWT private key
	'private_key': 'yoursupersecretprivatekey'

};
```
