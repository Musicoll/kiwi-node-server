const router = require('express').Router();
const utils = require('./utils');
const FileModel = require('../../models/File');

const Drive = require('../../controllers/drive');


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

router.post('/', (req, res) => {

  FileModel.create(req.body)
  .then(file => { res.json(file); })
  .catch(err => {
    utils.sendJsonError(res, "Error creating file", 500);
  });

});

router.get('/folder/:id', (req, res) => {

  FileModel.findById(req.params.id)
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
router.post('/:id', (req, res) => {

  let drive = new Drive();

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


module.exports = router;
