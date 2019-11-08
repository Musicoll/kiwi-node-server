// Load packages
const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const config = require('config');
const db = require('./db');
const path = require('path');
const favicon = require('serve-favicon')
const https = require('https')
const http = require('http')
const fs = require('fs')

// Create the Express application.
let app = express();
let server;
let secure_server;

// view setup
require('./views').setup(app);

// Use application-level middleware for common functionality
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(bodyParser.raw())

// passport needs to come after session initialization
const auth = require('./auth')();
app.use(auth.initialize());

app.use(favicon(path.join(__dirname, 'public', 'favicons', 'favicon.ico')))

// set the public directory to serve from static ressources
app.use('/assets', express.static(__dirname + '/assets'));

require('./routes').setup(app);

connectDataBase = (done) => {
  db.connect(err => {
    typeof done === 'function' && done(err)
  })
}

// Start server (only if this file has been called directly)
startServer = (done) => {

  var appDir = path.dirname(require.main.filename);

  var options = {
    key: fs.readFileSync(path.join(appDir, config.ssl_key)),
    cert: fs.readFileSync(path.join(appDir, config.ssl_certificate))
  };

  secure_server = https.createServer(options, app)

  secure_server.listen(config.secure_port, function () {
    console.log('Kiwi server listening on port : ' + config.secure_port)
    typeof done === 'function' && done()
  })

  server = http.createServer(function(req, res){
    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
    res.end(JSON.stringify({"error" : true, "message" : "Kiwi's server is now secure. Please download latest version and reset network settings."}));
  });

  server.listen(config.port, function () {
    console.log('Kiwi redirection server listening on port : ' + config.port)
  })
}

closeServer = (done) => {

  if (server)
  {
    server.close();
  }

  if (secure_server)
  {
    secure_server.close();
  }

  done()
}

module.exports = {
  connectDataBase: connectDataBase,
  startServer: startServer,
  closeServer: closeServer,
  app: app
}
