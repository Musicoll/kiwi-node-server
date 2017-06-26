// Load packages
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
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

// Use application-level middleware for common functionality, including
// cookies, parsing, and session handling.
app.use(require('cookie-parser')());
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use(session({
  secret: config.secret_session,
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: (1 * 24 * 60 * 60)
  }),
  cookie: { maxAge: (1 * 24 * 60 * 60)},
  resave: false,
  saveUninitialized: false
}));

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
