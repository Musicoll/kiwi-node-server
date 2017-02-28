// server listening port config
const port = 8080;

// Load packages
let express = require('express');
let bodyParser = require('body-parser');
let mongoose = require('mongoose');
let jwt = require('jsonwebtoken');

// get our private config file
let config = require('./private/config');

// set Promise provider to bluebird
mongoose.Promise = require('bluebird');

// Connect to MongoDB and create/use database
mongoose.connect(config.database)
  .then(() =>  console.log('DataBase connection established !'))
  .catch((err) => console.error('DataBase connection error: ' + err));

let app = express();

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// set the view engine
app.set('view engine', 'ejs')

// set the public directory to serve from static ressources
app.use('/assets', express.static('public'))

// Index route
let indexRoute = require('./routes/index');
app.use('/', indexRoute);

// API route
let apiRoute = require('./routes/api');
app.use('/api', apiRoute);

// GET a 404 error page for all other routes
app.all('/*', function(request, response, next) {
  response
  .status(404)
  .render('pages/error404', {title: 'Page not found'})
});

let server = app.listen(port, function () {
  console.log('Kiwi server listening on port : ' + port)
})
