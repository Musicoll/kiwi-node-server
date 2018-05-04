# Add your own config files

This project uses the [node-config](https://github.com/lorenwest/node-config) module to support multiple server configurations.  
You can add your own configuration file to this directory as explained [here](https://github.com/lorenwest/node-config/wiki/Configuration-Files).  

Ex:

```js
{
	// listening port
	"port": 8080,

	// database
	"db_url": "mongodb://localhost/KiwiAPI-dev",

	// private key to encode user token
	"private_key": "secretkey",

	// mail sender info
	"mail_service":
	{
		"service": "Gmail",
		"auth": {
				"user": "youremailaddress@email.com",
				"pass": "emailpassword"
		}
	},

	// flip binary port
	"session_port": 9090,

	// session server backend directory
	"backend_directory": "server_backend"

	// token to verify open grant between flip and api server
	"open_token": "youropentoken"

	// the compatible version of kiwi.
	"kiwi_version": "v1.0.0"
}

```
