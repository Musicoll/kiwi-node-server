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

// GET /documents
router.get('/documents', (req, res) => {
  // Find all data in the PatcherDocument collection
  PatcherDocument.find(function (err, patchers) {
    if (err) return console.error(err);
    res.json(patchers)
  });
});

// POST /documents
router.post('/documents', (req, res) => {
  PatcherDocument.create(req.body, function (err, patcher) {
    if (err) return next(err);
    res.json(patcher);
  });
});

// GET /documents/:id
router.get('/documents/:id', (req, res, next) => {
  PatcherDocument.findById(req.params.id, function (err, patcher) {
    if (err) return next(err);
    res.json(patcher);
  });
});

// DELETE /documents/:id
router.delete('/documents/:id', (req, res, next) => {
  PatcherDocument.findByIdAndRemove(req.params.id, req.body, (err, patcher) => {
    if (err) return next(err);
    res.json(patcher);
  });
});

module.exports = router;
