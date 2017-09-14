// ------------------------------------------------------------------------- //
// Drive Router
// ------------------------------------------------------------------------- //

const router = require('express').Router();
const { sendJsonError } = require('./utils');
const Drive = require('../../controllers/drive');
const auth = require('../../auth')();

/**
 * @api {get} /files Lists the user's files
 * @apiName ListUsersFiles
 * @apiGroup File
 * @apiVersion 0.1.0
 */
router.get('/files', (req, res) => {

  let drive = new Drive(req.user);

  drive.listFiles({})
  .then(files => {
    res.json(files);
  })
  .catch(err => {
    sendJsonError(res, err.message, err.status);
  });

});

/**
 * @api {get} /files/:fileId Gets a file's metadata by ID.
 * @apiName GetFileData
 * @apiGroup File
 * @apiVersion 0.1.0
 */
router.get('/files/:fileId', (req, res) => {

  let drive = new Drive(req.user);

  drive.listFiles(req.params.fileId)
  .then(files => {
    res.json(files);
  })
  .catch(err => {
    sendJsonError(res, err.message, err.status);
  });

});

/**
 * @api {post} /files Insert a new File.
 * @apiName InsertFile
 * @apiGroup File
 * @apiVersion 0.1.0
 */
 router.post('/files', (req, res) => {
   let drive = new Drive(req.user);

   let options = {
     isFolder: req.body.isFolder || false
   };

   if(req.body.name) {
     options.name = req.body.name;
   }

   drive.add(options)
   .then(doc => {
     res.json(doc);
   })
   .catch(err => {
     sendJsonError(res, err.message, err.status);
   });

 });

 /**
  * @api {post} /files/:id Insert a new File.
  * @apiName InsertFile
  * @apiGroup File
  * @apiVersion 0.1.0
  */

// id du dossier où placer le nouveau dossier ou fichier
router.post('/files/:fileId', (req, res) => {

  let drive = new Drive(req.user);

  drive.add({
    parent: req.params.fileId,
    name: req.body.name || '',
    isFolder: req.body.isFolder || false,
  })
  .then(file => {
    res.json(file);
  })
  .catch(err => {
    sendJsonError(res, err.message, err.status);
  });

});

// id du dossier ou fichier à supprimer.
router.delete('/files/:fileId', (req, res) => {

  let drive = new Drive(req.user);

  drive.remove(req.params.fileId)
  .then(message => {
    res.json(message);
  })
  .catch(err => {
    sendJsonError(res, err.message, err.status);
  });

});


module.exports = router;
