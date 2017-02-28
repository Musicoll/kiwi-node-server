let express = require('express');
let router = express.Router();

// Create a model based on the schema
let PatcherDocument = require('../../models/PatcherDocument');

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

/**
 * Send the response formatted with a json error and an error status set
 * @param {Object} response - the http response object
 * @param {String} message - the error message
 * @return {Number} status - the error code to set
 */
let sendJsonError = (response, message = "An error occured !", status = 404) => {
  response
  .status(404)
  .json({"error" : true, "message" : message});
}

// GET /documents
router.get('/', (req, res) => {

  // Find all data in the PatcherDocument collection
  PatcherDocument.find()
    .then((patchers) => { res.json(patchers) })
    .catch((err) => {
      sendJsonError(res, "Error fetching documents", 404);
    });

});

// POST /documents
router.post('/', (req, res) => {

  PatcherDocument.create(req.body)
    .then((patcher) => { res.json(patcher); })
    .catch((err) => {
      sendJsonError(res, "Error creating document", 500);
    });

});

// GET /documents/:id
router.get('/:id', (req, res) => {

  PatcherDocument.findById(req.params.id)
    .then((patcher) => { res.json(patcher) })
    .catch((err) => {
      sendJsonError(res, "Error fetching document", 404);
    });

});

// DELETE /documents/:id
router.delete('/:id', (req, res, next) => {

  // Todo: return an error when deleting a document already deleted
  // for now this returns a success message :(

  PatcherDocument.findByIdAndRemove(req.params.id)
    .then((patcher) => {
      res.json({"error" : false, "message" : "document " + req.params.id + " deleted"});
    })
    .catch((err) => {
      sendJsonError(res, "Error fetching document to delete", 404);
    });

});

// PUT /documents/:id
router.put('/:id', (req, res, next) => {

  PatcherDocument.findByIdAndUpdate(req.params.id, req.body)
    .then((patcher) => {
      res.json({"error" : false, "message" : "document " + req.params.id + " updated"});
    })
    .catch((err) => {
      sendJsonError(res, "Error fetching document to update", 404);
    });

});

module.exports = router;
