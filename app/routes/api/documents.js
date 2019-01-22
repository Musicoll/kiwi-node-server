const router = require('express').Router();
const utils = require('./utils');
const PatcherDocument = require('../../models/PatcherDocument');
const auth = require('../../auth')();
const config = require('config');
const path = require('path');
const fs = require('fs')

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
router.get('/', auth.authenticate(), (req, res) => {

  // Find all data in the PatcherDocument collection
  PatcherDocument.find()
    .populate('createdBy', 'email username')
    .populate('lastOpenedBy', 'email username')
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
router.post('/', auth.authenticate(), (req, res) => {

    let request = {
        name: req.body.name,
        createdBy: req.user._id,
        lastOpenedBy: req.user._id
    }

    PatcherDocument.create(request)
    .then(patcher => {
        patcher.populate('createdBy', 'username email', function(err) {
            patcher.populate('lastOpenedBy', 'username email', function(err) {
                res.json(patcher);
            })
        })
    })
})

router.post('/upload', auth.authenticate(), (req, res) => {

    let request = {
        name: req.query.name,
        createdBy: req.user._id,
        lastOpenedBy: req.user._id
    }

    PatcherDocument.create(request)
      .then(patcher => {

          let file = path.join(config.BACKEND_DIR, patcher.session_id.toLowerCase() + '.kiwi');

          fs.writeFile(file, req.body, function(err) {

              if (err)
              {
                  utils.sendJsonError(res, "Error creating document", 500);
                  PatcherDocument.findOneAndRemove({_id, patcher_id}, function(err){
                      return;
                  });
              }
              else {

                  fs.chmod(file, 0666, function(err){
                      patcher.populate('createdBy', 'username email', function(err) {
                          patcher.populate('lastOpenedBy', 'username email', function(err) {
                              res.json(patcher);
                          })
                      });
                  })
              }
          })
      })
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
router.get('/:id', auth.authenticate(), (req, res) => {

  PatcherDocument.findById(req.params.id)
    .populate('createdBy', 'username email')
    .populate('lastOpenedBy', 'username email')
    .then(patcher => { res.json(patcher) })
    .catch(err => {
      utils.sendJsonError(res, "DocumentNotFound", 404);
    });
});

router.get('/:id/download', auth.authenticate(), (req, res) => {

    PatcherDocument.findById(req.params.id)
      .populate('createdBy', 'username email')
      .populate('lastOpenedBy', 'username email')
      .then(patcher => {

        let backend_dir = config.BACKEND_DIR
        let file = path.join(backend_dir, patcher.session_id.toLowerCase() + '.kiwi');

          if (fs.existsSync(file) == false)
          {
              file = path.join(backend_dir, 'empty.kiwi');
          }

          res.download(file, patcher.session_id + '.kiwi', function(err) {
              if (err){
                  utils.sendJsonError(res, "File not found", 404);
              }
          });
      })
      .catch(err => {
        utils.sendJsonError(res, "DocumentNotFound", 404);
      });
  });

function copyFile(src_file, dst_file, next) {

  var read_stream = fs.createReadStream(src_file);

  read_stream.on("error", function(err) {
    next(err);
  });

  var write_stream = fs.createWriteStream(dst_file);

  write_stream.on("error", function(err) {
    next(err);
  });

  write_stream.on("close", function(ex) {
    next();
  });

  read_stream.pipe(write_stream);
}

// Create a clone of the document.
router.post('/:id/clone', auth.authenticate(), (req, res) => {

    PatcherDocument.findById(req.params.id)
    .then(patcher_src => {

        let request = {
            name: patcher_src.name + "_copy",
            createdBy: req.user._id,
            lastOpenedBy: req.user._id
        }

        PatcherDocument.create(request)
        .then(patcher_dst => {

            let backend_dir = config.BACKEND_DIR
            var src_file = path.join(backend_dir, patcher_src.session_id.toLowerCase() + '.kiwi');

            if (fs.existsSync(src_file) == false)
            {
                src_file = path.join(backend_dir, 'empty.kiwi');
            }

            var dst_file = path.join(backend_dir, patcher_dst.session_id.toLowerCase() + '.kiwi');

            copyFile(src_file, dst_file, function(err){

                if (err){
                    utils.sendJsonError(res, "Error copying ressource", 500);
                    PatcherDocument.findOneAndRemove({_id, patcher_id}, function(err){
                        return;
                    });
                }
                else {

                    fs.chmod(dst_file, 0666, function(err){
                        patcher_dst.populate('createdBy', 'username email', function(err) {
                            patcher_dst.populate('lastOpenedBy', 'username email', function(err) {
                                res.json(patcher_dst);
                            })
                        })
                    })
                }
            })
        })
    })
    .catch(err =>{
        utils.sendJsonError(res, "DocumentNotFound", 404);
    })
})

/**
 * @api {get} /documents/:id/open Request a toke for opening file.
 * @apiName OpenDocument
 * @apiGroup Documents
 * @apiVersion 0.0.1
 *
 * @apiParam {ObjectId} id Document unique Object Id.
 *
 * @apiSuccess {String} token access token that flip server to open document.
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 *   {
 *      "_id": "58b1ab53b65b10af1123409e",
 *    }
 *
 *
 * @apiUse DocumentNotFoundError
 *
 */
router.get('/:id/opentoken', auth.authenticate(), (req, res) => {

    let query = {lastOpenedAt: Date.now(), lastOpenedBy: req.user._id}

    PatcherDocument.findByIdAndUpdate(req.params.id, query)
      .then(patcher => {
        res.json({"error" : false,
                  "token" : config.open_token});
      })
      .catch(err => {
          utils.sendJsonError(res, "DocumentNotFound", 404);
      })
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
router.put('/:id', auth.authenticate(), (req, res, next) => {

    if (req.body.trashed && req.body.trashed == true){
        req.body.trashedBy = req.user._id;
        req.body.trashedDate = Date.now();
    }

  PatcherDocument.findByIdAndUpdate(req.params.id, req.body)
    .then(patcher => {
      res.json({"error" : false, "message" : "document " + req.params.id + " updated"});
    })
    .catch(err => {
        if (err.code == 'CreatedBy') {
            utils.sendJsonError(res, 'createdBy not allowed update', 400);
        }
        else if(err.code == 'Trash'){
            utils.sendJsonError(res, 'updating trash failed', 500);
        }
        else {
            utils.sendJsonError(res, "DocumentNotFound", 404);
        }
    });

});

module.exports = router;
