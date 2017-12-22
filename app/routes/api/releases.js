const router = require('express').Router();
const GitHubApi = require('github')
const utils = require('./utils');

/**
 * @api {get} /releases Request all Kiwi releases
 * @apiName GetReleases
 * @apiGroup Releases
 * @apiVersion 0.0.1
 * @apiDescription Api releases endpoint uses github api to retrieve release.
 * Please check for more infos. https://developer.github.com/v3/repos/releases/
 *
 * @apiExample {curl} Example usage:
 *     curl -i http://localhost:8080/api/releases
 *
 * @apiSuccess {Array} array An array of Releases.
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * [
 *   {
 *      "_url": "https://api.github.com/repos/Musicoll/Kiwi/releases/6563323",
 *      ...
 *      "id": 6563323,
 *      "tag_name": "v0.1.0",
 *      "name": "Kiwi v0.1.0",
 *    },
 *    {
 *      "_url": "https://api.github.com/repos/Musicoll/Kiwi/releases/4673047",
 *      ...
 *      "id": 4673047,
 *      "tag_name": "v0.0.3",
 *      "name": "Kiwi v0.3.0",
 *    }
 * ]
 */
router.get('/', (req, res) => {

    var github = new GitHubApi({});

    github.repos.getReleases({
      owner: 'MUSICOLL',
      repo: 'Kiwi'
    })
    .then(result => {
        res.json(result.data)
    })
});

/**
 * @api {get} /releases/latest Request the latest Kiwi release
 * @apiName GetLatestRelease
 * @apiGroup Releases
 * @apiVersion 0.0.1
 * @apiDescription Api releases endpoint uses github api to retrieve release.
 * Please check for more infos. https://developer.github.com/v3/repos/releases/
 *
 * @apiExample {curl} Example usage:
 *     curl -i http://localhost:8080/api/releases/latest
 *
 * @apiSuccess Infos regarding latest Kiwi release.
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 *   {
 *      "_url": "https://api.github.com/repos/Musicoll/Kiwi/releases/6563323",
 *      ...
 *      "id": 6563323,
 *      "tag_name": "v0.1.0",
 *      "name": "Kiwi v0.1.0",
 *    }
 */
router.get('/latest', (req, res) => {

    var github = new GitHubApi({});

    github.repos.getLatestRelease({
      owner: 'MUSICOLL',
      repo: 'Kiwi'
    })
    .then(result => {
        res.json(result.data)
    })
});

module.exports = router;
