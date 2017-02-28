let express = require('express');
let router = express.Router();
let utils = require('./utils');

// Get the user model
let User = require('../../models/User');

// GET /users
router.get('/', (req, res) => {

  // Find all data in the User collection
  User.find()
    .then((users) => { res.json(users) })
    .catch((err) => {
      utils.sendJsonError(res, "Error fetching users", 404);
    });

});

// POST /users
router.post('/', (req, res) => {

  User.create(req.body)
    .then((user) => { res.json(user); })
    .catch((err) => {
      utils.sendJsonError(res, "Error creating user : " + err, 500);
    });

});

// GET /users/:id
router.get('/:id', (req, res) => {

  User.findById(req.params.id)
    .then((user) => { res.json(user) })
    .catch((err) => {
      utils.sendJsonError(res, "Error fetching user", 404);
    });

});

// DELETE /users/:id
router.delete('/:id', (req, res, next) => {

  // Todo: return an error when deleting a user already deleted
  // for now this returns a success message :(

  User.findByIdAndRemove(req.params.id)
    .then((user) => {
      res.json({"error" : false, "message" : "user " + req.params.id + " deleted"});
    })
    .catch((err) => {
      utils.sendJsonError(res, "Error fetching user to delete", 404);
    });

});

// PUT /users/:id
router.put('/:id', (req, res, next) => {

  User.findByIdAndUpdate(req.params.id, req.body)
    .then((user) => {
      res.json({"error" : false, "message" : "user " + req.params.id + " updated"});
    })
    .catch((err) => {
      utils.sendJsonError(res, "Error fetching user to update", 404);
    });

});

module.exports = router;
