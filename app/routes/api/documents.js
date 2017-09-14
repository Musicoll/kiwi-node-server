// ------------------------------------------------------------------------- //
// Document Router
// ------------------------------------------------------------------------- //

const router = require('express').Router();
const { sendJsonError } = require('./utils');
const Document = require('../../models/Document');

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

  const userId = '53408DFA5620C9C2';

  var query = {
    // mongo condition
    condition: {
        name: /^Test/,
        owner: userId
    },
    // selected fields
    fields: {},

    // sorting
    sort: { name: -1}
  };

  const documentRootId = '69BD654D8B105F35';

  Document.GetChildren({_id: documentRootId}, query, (err, tree) => {
    if(err) {
      console.log("err: " + err);
      sendJsonError(res, "Error fetching documents", 404);
      return;
    }

    let data = {
      kind: "Kiwi#DocumentList",
      items: tree
    }

    data.items.forEach(function(doc) {
      doc.kind = "Kiwi#Document"
    });

    res.json(data)
  });

/*
  Document.findById(documentRootId)
  .then(root => {

    root.getArrayTree(query, (err, tree) => {
      if(err) {
        console.log("err: " + err);
        sendJsonError(res, "Error fetching documents", 404);
        return;
      }

      console.log("tree: " + tree);

      let data = {
        kind: "Kiwi#DocumentList",
        items: tree
      }

      data.items.forEach(function(doc) {
        doc.kind = "Kiwi#Document"
      });

      res.json(data)
    });
  })
  .catch(err => {
    console.log("err: " + err);
    sendJsonError(res, "Can't find user root", 404);
  });
*/

/*
  // Find all data in the Document collection
  Document.find({owner: '53408DFA5620C9C2'})
  .lean()
  .select('-path')
  .then(documents => {

    let data = {
      kind: "Kiwi#DocumentList",
      items: documents
    }

    data.items.forEach(function(doc) {
      doc.kind = "Kiwi#Document"
    });

    res.json(data)
  })
  .catch(err => {
    console.log("err: " + err);
    sendJsonError(res, "Error fetching documents", 404);
  });
*/

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

  Document.create(req.body)
    .then(patcher => { res.json(patcher); })
    .catch(err => {
      sendJsonError(res, "Error creating document", 500);
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

  const doc_id = req.params.id;

  Document.findById(doc_id, (err, doc) => {
    if(err || !doc) {
      sendJsonError(res, `Document ${doc_id} not found`, 404);
    }
    else {
      res.json(doc)
    }
  });

});

/**
 * @api {put} /documents/:id Update a Document
 * @apiName UpdateDocument
 * @apiGroup Documents
 * @apiVersion 0.0.1
 *
 * @apiParam {String} id The Document Id.
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

  const doc_id = req.params.id;

  Document.findById(doc_id, (err, doc) => {
    if(err || !doc) {
      sendJsonError(res, `Document ${doc_id} not found`, 404);
    }
    else {

      let newdoc = req.body;

      if(newdoc.name) {
        doc.name = newdoc.name
      }

      if(newdoc.description) {
        doc.description = newdoc.description
      }

      doc.save()
      .then((doc2) => {
        res.json({"error" : false, "message" : "document " + doc_id + " deleted"});
      })
      .catch(err => {
        sendJsonError(res, "DocumentUpdateError", 500);
      });

    }
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

  const doc_id = req.params.id;

  Document.findById(doc_id, (err, doc) => {
    if(err || !doc) {
      sendJsonError(res, `Document ${doc_id} not found`, 404);
    }
    else {
      doc.remove()
      .then((d) => {
        res.json({"error" : false, "message" : "document " + doc_id + " deleted"});
      })
      .catch(err => {
        sendJsonError(res, "DocumentRemoveError", 500);
      });
    }
  });

});

module.exports = router;
