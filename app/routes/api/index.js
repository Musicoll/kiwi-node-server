const router = require('express').Router();
const utils = require('./utils');

const api_paths = {
  auth_url:       "/auth",
  users_url:      "/users",
  user_url :      "/users/:id",
  documents_url:  "/documents",
  document_url:   "/documents/:id",
  releases_url:   "/releases"
}

/**
 * @api {get} / Request API Paths
 * @apiName GetApiPaths
 * @apiGroup Global
 * @apiVersion 0.0.1
 *
 * @apiSuccess {String} auth_url Authorization path.
 * @apiSuccess {String} users_url Path to make User request.
 * @apiSuccess {String} user_url Path to make single User request.
 * @apiSuccess {String} documents_url Path to make Document request.
 * @apiSuccess {String} document_url Path to make single Document request.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *        "auth_url":       "/auth",
 *        "users_url":      "/users",
 *        "user_url" :      "/users/:id",
 *        "documents_url":  "/documents",
 *        "document_url":   "/documents/:id",
 *        "releases_url":   "/releases"
 *     }
 */
router.get('/', (req, res, next) => {
  res.json(api_paths);
});

// Authentication endpoint
router.post('/login', require('./auth').login);

// documents endpoints
router.use('/documents', require('./documents'));

// users endpoints
router.use('/users', require('./users'));

// drive endpoints
// router.use('/drive', require('./drive'));

// releases endpoint
router.use('/release', require('./release'));

// Send an invalid api path error message for all other routes
router.all('/*', (req, res, next) => {
  utils.sendJsonError(res, "Invalid api path !", 404);
});

module.exports = router;
