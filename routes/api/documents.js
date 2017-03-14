let express = require('express');
let router = express.Router();
let utils = require('./utils');

// Create a model based on the schema
let PatcherDocument = require('../../models/PatcherDocument');

/**
 * @api {get} /documents Request a list of Documents
 * @apiName GetDocuments
 * @apiGroup Documents
 * @apiVersion 0.0.1
 *
 * @apiSuccess {Array} array An array of Documents.
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * [
 *   {
 *      "_id": "58b1ab53b65b10af1123409e",
 *      "__v": 0,
 *      "updated_at": "2017-02-25T16:05:39.707Z",
 *      "name": "foo.kiwi"
 *    },
 *    {
 *      "_id": "58b251234647981792b6fd42",
 *      "__v": 0,
 *      "updated_at": "2017-02-26T04:10:57.184Z",
 *      "name": "bar.kiwi"
 *    }
 * ]
 */
router.get('/', (req, res) => {

  // Find all data in the PatcherDocument collection
  PatcherDocument.find()
    .then(patchers => { res.json(patchers) })
    .catch(err => {
      utils.sendJsonError(res, "Error fetching documents", 404);
    });

});

// POST /documents
router.post('/', (req, res) => {

  PatcherDocument.create(req.body)
    .then(patcher => { res.json(patcher); })
    .catch(err => {
      utils.sendJsonError(res, "Error creating document", 500);
    });

});

/**
 * @api {get} /documents/:id Request single Document informations
 * @apiName GetDocument
 * @apiGroup Documents
 * @apiVersion 0.0.1
 *
 * @apiParam {ObjectId} id Document unique ID.
 *
 * @apiSuccess {ObjectId} _id Document unique ID.
 * @apiSuccess {String}   name The name of the document.
 * @apiSuccess {Date}     updated_at Path to make single User request.
 * @apiSuccess {Number}   __v Document api model version number.
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 *   {
 *      "_id": "58b1ab53b65b10af1123409e",
 *      "__v": 0,
 *      "updated_at": "2017-02-25T16:05:39.707Z",
 *      "name": "foo.kiwi"
 *    }
 *
 *
 * @apiError DocumentNotFound The id of the Document was not found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *        "error": true,
 *        "message": "DocumentNotFound"
 *     }
 */
router.get('/:id', (req, res) => {

  PatcherDocument.findById(req.params.id)
    .then(patcher => { res.json(patcher) })
    .catch(err => {
      utils.sendJsonError(res, "DocumentNotFound", 404);
    });

});

// DELETE /documents/:id
router.delete('/:id', (req, res, next) => {

  // Todo: return an error when deleting a document already deleted
  // for now this returns a success message :(

  PatcherDocument.findByIdAndRemove(req.params.id)
    .then(patcher => {
      res.json({"error" : false, "message" : "document " + req.params.id + " deleted"});
    })
    .catch(err => {
      utils.sendJsonError(res, "Error fetching document to delete", 404);
    });

});

// PUT /documents/:id
router.put('/:id', (req, res, next) => {

  PatcherDocument.findByIdAndUpdate(req.params.id, req.body)
    .then(patcher => {
      res.json({"error" : false, "message" : "document " + req.params.id + " updated"});
    })
    .catch(err => {
      utils.sendJsonError(res, "Error fetching document to update", 404);
    });

});

module.exports = router;
