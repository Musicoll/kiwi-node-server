const router = require('express').Router();
const config = require('config');
const utils = require('./utils');

/**
 * @api {get} /releases Request the kiwi version compatible with this API.
 * @apiName GetRelease
 * @apiGroup Releases
 * @apiVersion 0.0.1
 * @apiDescription Api release endpoing check release stored in config.
 *
 * @apiExample {curl} Example usage:
 *     curl -i http://localhost:8080/api/release
 *
 * @apiSuccess Infos regarding latest Kiwi release.
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 *   {
 *      "release": "v0.1.0",
 *    }
 */
router.get('/', (req, res) => {

    if (config.kiwi_version)
    {
        res.json({release: config.kiwi_version});
    }
    else
    {
        utils.sendJsonError(res, "Error retrieving kiwi version", 404);
    }
});

module.exports = router;
