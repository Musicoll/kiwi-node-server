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

  newuser.save((err, user) => {
    if(err) {

      // Get the user's fields
      const fields = User.schema.paths;
      let errorMessage = "";

      for (let field in fields){
          if (err.errors[field]) {
            errorMessage += `- ${err.errors[field].message}`;
            errorMessage += "\n";
            
            console.log(`"${field}" error: ${err.errors[field].message}`);
          }
      }

      if(!errorMessage){
        errorMessage = err.message;
      }

      utils.sendJsonError(res, errorMessage, 206);
    }
    else if(!user) {
      utils.sendJsonError(res, `Creating new user failed`, 500);
    }
    else {
      res.json({user: user})
    }
  });
});

// GET /users/:id
router.get('/:id', (req, res) => {

  const user_id = req.params.id;

  User.findById(user_id, (err, user) => {
    if(err || !user) {
      utils.sendJsonError(res, `User ${user_id} not found`, 404);
    }
    else {
      res.json(user)
    }
  });

});

// DELETE /users/:id
router.delete('/:id', (req, res, next) => {

  // Todo: return an error when deleting a user already deleted
  // for now this returns a success message :(

  const user_id = req.params.id;

  User.findByIdAndRemove(user_id, (err, user) => {
    if(err || !user) {
      utils.sendJsonError(res, `Deleting user ${user_id} failed`, 404);
    }
    else {
      res.json({"error" : false, "message" : `user ${user_id} deleted`});
    }
  });

});

// PUT /users/:id
router.put('/:id', (req, res, next) => {

  const user_id = req.params.id;

  User.findByIdAndUpdate(user_id, req.body, { runValidators: true }, (err, user) => {
    if(err || !user) {
      utils.sendJsonError(res, "Updating user failed", 404);
    }
    else {
      res.json({"error" : false, "message" : `user ${user_id} updated`});
    }
  });

});

module.exports = router;
