// Load packages
let express = require('express');
let session = require('express-session');
let passport = require('passport');
let bodyParser = require('body-parser');
let config = require('config');
let db = require('./db');
let path = require('path');
let favicon = require('serve-favicon')

// Create the Express application.
var app = express();

// view setup
require('./views').setup(app);

// Use application-level middleware for common functionality, including
// cookies, parsing, and session handling.
app.use(require('cookie-parser')());
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));

// passport needs to come after session initialization
const auth = require('./authenticate');
app.use(passport.initialize());
app.use(passport.session());

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
