// Load packages
const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const config = require('config');
const db = require('./db');
const path = require('path');
const favicon = require('serve-favicon')

// Create the Express application.
let app = express();

// view setup
require('./views').setup(app);

// Use application-level middleware for common functionality
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

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
  return app.listen(config.port, function () {
    console.log('Kiwi server listening on port : ' + config.port)
    typeof done === 'function' && done()
  })
}

module.exports = {
  connectDataBase: connectDataBase,
  startServer: startServer,
  app: app
}
