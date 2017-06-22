let express = require('express');
let router = express.Router();
let utils = require('./utils');

// Create a model based on the schema
let PatcherDocument = require('../../models/PatcherDocument');

/**
 * @apiDefine DocumentNotFoundError
 * @apiError DocumentNotFound The id of the Document was not found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *        "error": true,
 *        "message": "DocumentNotFound"
 *     }
 */

/**
 * @api {get} /documents Request a list of Documents
 * @apiName GetDocuments
 * @apiGroup Documents
 * @apiVersion 0.0.1
 *
 * @apiExample {curl} Example usage:
 *     curl -i http://localhost:8080/api/documents
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
 *      "name": "foo.kiwi",
 *      "session_id": "58EA0C2B0F69F0FF"
 *    },
 *    {
 *      "_id": "58b251234647981792b6fd42",
 *      "__v": 0,
 *      "updated_at": "2017-02-26T04:10:57.184Z",
 *      "name": "bar.kiwi",
 *      "session_id": "2BEACC250FD9F9AE"
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

/**
 * @api {post} /documents Create a new Document
 * @apiName NewDocument
 * @apiGroup Documents
 * @apiVersion 0.0.1
 *
 * @apiHeader {String} [name="Untitled.kiwi"] The name of the Document.
 *
 * @apiSuccess {String}   _id Document unique ID.
 * @apiSuccess {String}   name The name of the document.
 * @apiSuccess {String}   session_id The session id of the document.
 * @apiSuccess {Date}     updated_at Path to make single User request.
 * @apiSuccess {Number}   __v Document api model version number.
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 *   {
 *      "_id": "58b1ab53b65b10af1123409e",
 *      "__v": 0,
 *      "updated_at": "2017-02-25T16:05:39.707Z",
 *      "name": "foo.kiwi",
 *      "session_id": "58EA0C2B0F69F0FF"
 *    }
 *
 */
router.post('/', (req, res) => {

  PatcherDocument.create(req.body)
    .then(patcher => { res.json(patcher); })
    .catch(err => {
      utils.sendJsonError(res, "Error creating document", 500);
    });

});

/**
 * @api {get} /documents/:id Request single Document
 * @apiName GetDocument
 * @apiGroup Documents
 * @apiVersion 0.0.1
 *
 * @apiParam {ObjectId} id Document unique Object Id.
 *
 * @apiSuccess {String}   _id Document unique ID.
 * @apiSuccess {String}   name The name of the document.
 * @apiSuccess {String}   session_id The session id of the document.
 * @apiSuccess {Date}     updated_at Path to make single User request.
 * @apiSuccess {Number}   __v Document api model version number.
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 *   {
 *      "_id": "58b1ab53b65b10af1123409e",
 *      "__v": 0,
 *      "updated_at": "2017-02-25T16:05:39.707Z",
 *      "name": "foo.kiwi",
 *      "session_id": "58EA0C2B0F69F0FF"
 *    }
 *
 *
 * @apiUse DocumentNotFoundError
 *
 */
router.get('/:id', (req, res) => {

  PatcherDocument.findById(req.params.id)
    .then(patcher => { res.json(patcher) })
    .catch(err => {
      utils.sendJsonError(res, "DocumentNotFound", 404);
    });

});

/**
 * @api {put} /documents/:id Update a Document
 * @apiName UpdateDocument
 * @apiGroup Documents
 * @apiVersion 0.0.1
 *
 * @apiParam {String} id The Document unique Object Id.
 *
 * @apiHeader {String} name The new name of the Document.
 *
 * @apiSuccess {Boolean} error false.
 * @apiSuccess {String}  message The success message.
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 *   {
 *      "error": false,
 *      "message": "document :id updated",
 *    }
 *
 * @apiUse DocumentNotFoundError
 *
 */
router.put('/:id', (req, res, next) => {

  PatcherDocument.findByIdAndUpdate(req.params.id, req.body)
    .then(patcher => {
      res.json({"error" : false, "message" : "document " + req.params.id + " updated"});
    })
    .catch(err => {
      utils.sendJsonError(res, "DocumentNotFound", 404);
    });

});

/**
 * @api {delete} /documents/:id Delete a Document
 * @apiName DeleteDocument
 * @apiGroup Documents
 * @apiVersion 0.0.1
 *
 * @apiParam {ObjectId} id The Document unique Object Id.
 *
 *
 * @apiSuccess {Boolean} error false.
 * @apiSuccess {String}  message The success message.
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 *   {
 *      "error": false,
 *      "message": "document :id deleted",
 *    }
 *
 * @apiUse DocumentNotFoundError
 *
 */
router.delete('/:id', (req, res, next) => {

  // Todo: return an error when deleting a document already deleted
  // for now this returns a success message :(

  PatcherDocument.findByIdAndRemove(req.params.id)
    .then(patcher => {
      res.json({"error" : false, "message" : "document " + req.params.id + " deleted"});
    })
    .catch(err => {
      utils.sendJsonError(res, "DocumentNotFound", 404);
    });

});

module.exports = router;
