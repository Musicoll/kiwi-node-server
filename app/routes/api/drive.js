// ------------------------------------------------------------------------- //
// Drive Router
// ------------------------------------------------------------------------- //

const router = require('express').Router();
const utils = require('./utils');
const FileModel = require('../../models/File');
const Drive = require('../../controllers/drive');
const auth = require('../../auth')();

router.get('/', (req, res) => {

  // Find all Files
  FileModel.GetFullArrayTree()
  .then(files => {
    res.json(files)
  },
  err => {
    utils.sendJsonError(res, "Error fetching files", 404);
  })

});

router.get('/folder/:id', (req, res) => {

  FileModel.findById(req.params.id)
  .populate('createdBy')
  .then(folder => {
    // returns the folder's subtree
    folder.getTree(function(err, files) {
        res.json(files)
    });
  })
  .catch(err => {
    utils.sendJsonError(res, "FolderNotFound", 404);
  });

});

// id du dossier où placer le nouveau dossier ou fichier
router.post('/:id', auth.authenticate(), (req, res) => {

  let drive = new Drive(req.user);

  drive.add(req.params.id, {
    name: req.body.name || '',
    isFolder: req.body.isFolder || false,
  })
  .then(file => {
    res.json(file);
  })
  .catch(err => {
    utils.sendJsonError(res, err.message, err.status);
  });

});

router.post('/', auth.authenticate(), (req, res) => {

  let drive = new Drive(req.user);

  drive.add(null, {
    name: req.body.name || '',
    isFolder: req.body.isFolder || false,
  })
  .then(file => {
    res.json(file);
  })
  .catch(err => {
    utils.sendJsonError(res, err.message, err.status);
  });

});

// id du dossier ou fichier à supprimer.
router.delete('/:id', auth.authenticate(), (req, res) => {

  let drive = new Drive(req.user);

  drive.remove(req.params.id)
  .then(message => {
    res.json(message);
  })
  .catch(err => {
    utils.sendJsonError(res, err.message, err.status);
  });

});


module.exports = router;
