let express = require('express');
let router = express.Router();
let utils = require('./utils');

// GET /
router.get('/', (req, res, next) => {
  res.json({
    auth_url:       "/auth",
    users_url:      "/users",
    user_url :      "/users/:id",
    documents_url:  "/documents",
    document_url:   "/documents/:id"
  })
});

// Authentication endpoint
router.use('/auth', require('./auth').router);

// documents endpoints
router.use('/documents', require('./documents'));

// users endpoints
router.use('/users', require('./users'));

// Send an invalid api path error message for all other routes
router.all('/*', (req, res, next) => {
  utils.sendJsonError(res, "Invalid api path !", 404);
});

module.exports = router;
