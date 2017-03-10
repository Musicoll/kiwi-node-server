// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// Load packages
let express = require('express');
let bodyParser = require('body-parser');
let config = require('config');

let app = express();

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// set the view engine
app.set('view engine', 'ejs')

// set the public directory to serve from static ressources
app.use('/assets', express.static(__dirname + '/../public'));

// Website routes
app.use('/', require('../routes/site/index'));

// API routes
app.use('/api', require('../routes/api/api'));

// GET a 404 error page for all other routes
app.all('/*', function(request, response, next) {
  response
  .status(404)
  .render('pages/error404', {title: 'Page not found'})
});

connectDataBase = (done) => {
  let db = require('./db');
  db.connect(err => {
    if(!err) {
      typeof done === 'function' && done()
    }
    else {
      typeof done === 'function' && done(err)
    }
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
