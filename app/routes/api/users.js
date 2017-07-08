const router = require('express').Router();
const utils = require('./utils');
const User = require('../../models/User');
const auth = require('../../auth')();

// GET /users/private (temporary private dummy endpoint)
router.get('/private', auth.authenticate(), (req, res) => {

  res.json({message: "Authenticated !", user: req.user})

});

// GET /users
router.get('/', (req, res) => {

  // Find all data in the User collection
  User.find()
    .then(users => { res.json(users) })
    .catch(err => {
      console.log(`Error fetching users : ${err}`);
      utils.sendJsonError(res, "Error fetching users", 404);
    });

});

// POST /users
router.post('/', function (req, res) {

  let newuser = new User(req.body);

  newuser.save()
  .then(user => { res.json(user) })
  .catch(err => {
    console.log(`Creating new user failed : ${err.message}`);

    if('email' in err.errors)
    {
      utils.sendJsonError(res, `${err.errors.email.message}`, 206);
    }
    else if('password' in err.errors)
    {
      utils.sendJsonError(res, `${err.errors.password.message}`, 206);
    }
    else {
      utils.sendJsonError(res, `Creating new user failed`, 500);
    }
  })

});

// GET /users/:id
router.get('/:id', (req, res) => {

  User.findById(req.params.id)
    .then(user => { res.json(user) })
    .catch(err => {
      console.log(`User ${req.params.id} can not be find : ${err}`);
      utils.sendJsonError(res, `User ${req.params.id} can not be find`, 404);
    });

});

// DELETE /users/:id
router.delete('/:id', (req, res, next) => {

  // Todo: return an error when deleting a user already deleted
  // for now this returns a success message :(

  User.findByIdAndRemove(req.params.id)
    .then(user => {
      res.json({"error" : false, "message" : "user " + req.params.id + " deleted"});
    })
    .catch(err => {
      console.log(`Deleting user ${req.params.id} failed : ${err}`);
      utils.sendJsonError(res, `Deleting user ${req.params.id} failed`, 404);
    });

});

// PUT /users/:id
router.put('/:id', (req, res, next) => {

  User.findByIdAndUpdate(req.params.id, req.body, { runValidators: true })
    .then(user => {
      res.json({"error" : false, "message" : "user " + req.params.id + " updated"});
    })
    .catch(err => {
      console.error(`Updating user failed : ${err}`);
      utils.sendJsonError(res, "Updating user failed", 404);
    });

});

module.exports = router;
