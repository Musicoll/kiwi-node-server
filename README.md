# kiwi-node-server
[![Build Status](https://travis-ci.org/Musicoll/kiwi-node-server.svg?branch=master)](https://travis-ci.org/Musicoll/kiwi-node-server)
[![Dependency Status](https://david-dm.org/Musicoll/kiwi-node-server.svg)](https://david-dm.org/Musicoll/kiwi-node-server)
[![devDependencies Status](https://david-dm.org/Musicoll/kiwi-node-server/dev-status.svg)](https://david-dm.org/Musicoll/kiwi-node-server?type=dev)
[![Documentation](https://img.shields.io/badge/KiwiAPI-documentation-blue.svg)](https://musicoll.github.io/kiwi-node-server/)

Node.js Web Server and API for [Kiwi](https://github.com/Musicoll/Kiwi).

## Dependencies

 - [Node.js](https://nodejs.org/en/)
 - [MongoDB](https://www.mongodb.com)
 - [npm](https://www.npmjs.com/)

## Install the server

- Install Node.js
  ```
  brew install node
  ```
  [Further information and other platforms](https://nodejs.org/en/download/current/)

- Install MongoDB
  ```
  brew update
  brew install mongodb
  mkdir -p /data/db
  ```
  [Further information](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x)  

- Install node package dependencies
  ```
  npm install
  ```

- Clone the repository
  ```
  git clone https://github.com/Musicoll/kiwi-node-server.git
  ```

- Create a JSON configuration file *prod.json*
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
  	"backend_directory": "../server_backend"
  	// token to verify open grant between flip and api server
  	"open_token": "youropentoken"
  	// the compatible version of kiwi.
  	"kiwi_version": "v1.0.0"
  }
  ```

- Organize the server   

  The backend directory must have the same relative path to the file *prod.json* as to the [Server application](https://github.com/Musicoll/Kiwi/releases) compiled with the main [Kiwi](https://github.com/Musicoll/Kiwi) repository. Here an example where the backend directory relative path is defined as previously "../server_backend".
  ```
  MainDir/
      config/
          prod.json
      kiwi-node-server/
          ...
      Server/
          Server (the Server application)
      server_backend/
          ...
    ```

## Run the server

- Launch MongoDB
  ```
  sudo killall -15 mongod (mac if necessary)
  sudo mongod (mac)
  sudo service mongodb start (linux)
  ```

- Launch the Server

  Using the default path and environment:
  ```
  cd kiwi-node-server
  npm start
  ```

  or manually with **NODE_CONFIG_DIR** the relative to the file *prod.json* and **NODE_ENV** the environment :
  ```
  cd kiwi-node-server
  NODE_CONFIG_DIR=../config NODE_ENV=prod node server.js
  ```

- Unit-tests
  ```
  npm test
  ```

- Unit-tests with coverage
  ```
  npm run test-cov
  ```
  The results will be located in *./coverage/lcov-report/index.html*.


## Connect to the server

- Open Kiwi
- Open the preferences
- Change the host (localhost), API port (8080) and session port (9090)
- Create a new account if required

## Generate documentation

- Install [apidoc](http://apidocjs.com/):
  ```
   npm install apidoc -g
  ```

- Generate the documentation
  ```
  npm run documentation
  ```

  it will generate the documentation in *./docs*.  
  Open *./docs/index.html* to see the documentation.
