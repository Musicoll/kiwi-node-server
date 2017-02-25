let express = require('express');
let app = express();
const port = 8080;

// Load mongoose package
let mongoose = require('mongoose');

// set Promise provider to bluebird
mongoose.Promise = require('bluebird');

// Connect to MongoDB and create/use database called KiwiAPI
mongoose.connect('mongodb://localhost/KiwiAPI')
  .then(() =>  console.log('DataBase connection established !'))
  .catch((err) => console.error('DataBase connection error: ' + err));

// Create a model based on the schema
let PatcherDocument = require('./models/PatcherDocument');

/*
// Create a patcher in memory
let patcher = new PatcherDocument({name: 'test.kiwi',});

// Save it to database
patcher.save(function(err) {
  if(err)
    console.log(err);
  else
    console.log(patcher);
});
*/

app.set('view engine', 'ejs')

app.use('/assets', express.static('public'))

// home route
app.get('/', (request, response) => {
  response.render('pages/index', {title : 'Home'})
})

// api endpoint
app.get('/api/documents', (request, response) => {

  // Find all data in the PatcherDocument collection
  PatcherDocument.find(function (err, patchers) {
    if (err) return console.error(err);
    response.json(patchers)
  });

})

// api endpoint
app.post('/api/documents', (request, response) => {
    
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

let server = app.listen(port, function () {
  console.log('Kiwi server listening on port : ' + port)
})
