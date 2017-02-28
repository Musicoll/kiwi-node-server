let express = require('express');
let router = express.Router();

// load documents routes
let documentsRoutes = require('./documents');

// GET /
router.get('/', (req, res, next) => {
  res.json({
    "documents_url" : "/documents",
    "document_url" : "/documents/:id"
  })
});

router.use('/documents', documentsRoutes);

// Send an invalid api path error message for all other routes
router.all('/*', (req, res, next) => {
  response
  .status(404)
  .json({"error" : true, "message" : "Invalid api path !"});
});

module.exports = router;
