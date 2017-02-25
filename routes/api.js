let express = require('express');
let router = express.Router();

// Create a model based on the schema
let PatcherDocument = require('../models/PatcherDocument');

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

/* GET api home message. */
router.get('/', function(req, res, next) {
  res.json({message: "Welcome to the Kiwi API !"})
});

router.get('/documents', (request, response) => {

  // Find all data in the PatcherDocument collection
  PatcherDocument.find(function (err, patchers) {
    if (err) return console.error(err);
    response.json(patchers)
  });

})

// api endpoint
router.post('/documents', (request, response) => {

})

module.exports = router;
