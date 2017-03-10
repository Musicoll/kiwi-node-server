// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// Load packages
let express = require('express');
let bodyParser = require('body-parser');
let config = require('config');

if(require.main === module) {

  let db = require('./db');
  db.connect()
}

let app = express();

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// set the view engine
app.set('view engine', 'ejs')

// set the public directory to serve from static ressources
app.use('/assets', express.static('public'))

// Website routes
app.use('/', require('./routes/site/index'));

// API routes
app.use('/api', require('./routes/api/api'));

// GET a 404 error page for all other routes
app.all('/*', function(request, response, next) {
  response
  .status(404)
  .render('pages/error404', {title: 'Page not found'})
});

// Start server (only if this file has been called directly)
if(require.main === module) {
  app.listen(config.port, function () {
    console.log('Kiwi server listening on port : ' + config.port)
  })
}

start = (done) => {
  let db = require('./db');
  db.connect(err => {
    if(!err) {
      done();
    }
    else {
      done(err);
    }
  })
}

module.exports = {
  start: start,
  app: app
}
