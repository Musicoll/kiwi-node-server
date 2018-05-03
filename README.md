# kiwi-node-server
[![Build Status](https://travis-ci.org/Musicoll/kiwi-node-server.svg?branch=master)](https://travis-ci.org/Musicoll/kiwi-node-server)
[![Dependency Status](https://david-dm.org/Musicoll/kiwi-node-server.svg)](https://david-dm.org/Musicoll/kiwi-node-server)
[![devDependencies Status](https://david-dm.org/Musicoll/kiwi-node-server/dev-status.svg)](https://david-dm.org/Musicoll/kiwi-node-server?type=dev)
[![Documentation](https://img.shields.io/badge/KiwiAPI-documentation-blue.svg)](http://musicoll.github.io/kiwi-node-server/)

Node.js Web Server and API for [Kiwi](https://github.com/Musicoll/Kiwi).

## Requirements

To use this repository you'll need to have these dependencies installed :

 - [Node.js](https://nodejs.org/en/)
 - [MongoDB](https://www.mongodb.com)
 - [npm](https://www.npmjs.com/)

## Installation

clone this repository then:

install node package dependencies using

```shell
$ npm install
```

then start the mongo database by typing in another console process
```shell
$ sudo mongod

# (linux):
$ sudo service mongodb start
```

## Run server

Kiwi Api server uses a configuration file written in json format specifying all needed information for the server to run properly.  Before running the server create your own configuration file. Example can be found under /config folder of the repository. A configuration file shall contain the following informations:

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

Once you have created it you can then (ex: config.json) refer to this config file and launch the server by executing following lines in a terminal.

Ex: if config file is /Dir/config.json

```shell
$ NODE_CONFIG_DIR=/Dir NODE_ENV=config node server.js
```

## Api Documentation

You can find the API documentation [here](https://musicoll.github.io/kiwi-node-server/). All endpoints are described and example are given on how to call them.

## Tests

Run the unit-tests by typing:
```shell
$ npm test
```

Or the unit-tests with coverage by typing:
```shell
$ npm run test-cov
```

Open `./coverage/lcov-report/index.html` to see coverage infos.

## Generate documentation

The documentation of the Kiwi API can be regenerated using [apidoc](http://apidocjs.com/).  
Install apidoc globally using: `npm install apidoc -g`, then type:

```shell
$ npm run documentation
```

it will generate the documentation in ./docs.  
Open ./docs/index.html to see the documentation.
