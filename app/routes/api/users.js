const router = require('express').Router();
const utils = require('./utils');
const User = require('../../models/User').User;
const TempUser = require('../../models/User').TempUser;
const auth = require('../../auth')();
const config = require('config');
const mail_service_config = require('config').mail_service;
const nodemailer = require('nodemailer');
const crypto = require("crypto")
const jwt = require('jsonwebtoken');

// GET /users/private (temporary private dummy endpoint)
router.get('/private', auth.authenticate(), (req, res) => {

  res.json({message: "Authenticated !", user: req.user})

});

// GET /users
router.get('/', (req, res) => {

    if (!req.query.ids){
        User.find()
          .then(users => { res.json(users) })
          .catch(err => {
            console.log(`Error fetching users : ${err}`);
            utils.sendJsonError(res, "Error fetching users", 404);
          });
    }
    else{
        let user_ids = JSON.parse(req.query.ids);

        User.find({
             _id: {$in: user_ids}
            })
        .then(users => {
            res.json(users);
        })
        .catch(err => {
            utils.sendJsonError(res, "Error fetching users", 404);
        });
    }
});

function sendEmail(options, next) {

    let transporter = nodemailer.createTransport({
        service: mail_service_config.service,
        auth: mail_service_config.auth
    });

    let mail_options = {
      from: mail_service_config.auth.user,
      to: options.to,
      subject: options.subject,
      html: options.html
    };

    transporter.sendMail(mail_options, function(error, info) {
        next(error, info);
    });
}

// POST /users
router.post('/', function (req, res) {

    if (!req.body.email || !req.body.username || !req.body.password) {
        utils.sendJsonError(res, 'Missing signup info', 400);
        return;
    }

    User.findOne({$or:[{email: req.body.email}, {username: req.body.username}]}, function(err, user) {
        if (user) {
            utils.sendJsonError(res, 'User already exists', 400);
        }
        else {

            TempUser.remove( {$or:[{email: req.body.email}, {username: req.body.username}]}, function(err) {

                if (err){
                    console.log(err)
                }
                else {

                    let newTempUser = new TempUser({username: req.body.username,
                                                    email: req.body.email,
                                                    password: req.body.password,
                                                    activationToken: crypto.randomBytes(32).toString('hex')
                    });

                    newTempUser.save((err, tempuser) => {
                        if (err || !tempuser) {

                            if (err.errors){
                                if (err.errors.email){
                                    utils.sendJsonError(res, 'Invalid email adress', 400)
                                }
                                else if(err.errors.username) {
                                    utils.sendJsonError(res, 'Invalid username', 400)
                                }
                            }
                            else {
                                utils.sendJsonError(res, 'User creation failed', 500);
                            }
                        }
                        else {
                            let token = tempuser.activationToken;
                            let tempuserid = tempuser._id;
                            let port = config.port;

                            let link= "http://"+req.hostname+":"+port+"/verify?tempuserid=" + tempuserid + "&token=" + token;

                            let mail_options = {
                              to: tempuser.email,
                              subject: 'Kiwi account activation.',
                              html: "Hello,<br> Please Click on following link to activate your account.<br><a href="+link+">Confirm account</a>"
                            };

                            sendEmail(mail_options, function(error, info) {
                                if(error) {
                                    utils.sendJsonError(res, "Sending confiration mail failed", 500);
                                }
                                else {
                                    res.json({message: "Activation mail sent"});
                                }
                            });
                        }
                    });
                }
            });
        }
    });
});

// POST /users/passwordtoken
router.post('/passtoken', (req, res) => {
    if (req.body.email){
        User.findOne({email: req.body.email}, function(err, user) {
            if (!err && user){
                let payload = {userid: user._id};
                let token = jwt.sign(payload, config.private_key, {
                    expiresIn: '24h'
                });

                let mail_options = {
                  to: user.email,
                  subject: 'Kiwi reset password.',
                  html: "Hello,<br> Open Kiwi and use this token to reset password<br>token: " + token
                };

                sendEmail(mail_options, function(error, info) {
                    if(error) {
                        utils.sendJsonError(res, "Sending reset password mail failed", 500);
                    }
                    else {
                        res.json({message: "Reset password sent"});
                    }
                })
            }
            else {
                utils.sendJsonError(res, `${req.body.email} not found`, 404);
            }
        })
    }
    else{
        utils.sendJsonError(res, 'email field required', 400);
    }
})

// POST /users/passwordreset
router.post('/passreset', (req, res) => {

    if (req.body.token && req.body.newpass){

        jwt.verify(req.body.token, config.private_key, function(err, decoded) {

            if (!err){

                const user_id = decoded.userid;

                const query = {
                    password: req.body.newpass
                }


                User.findByIdAndUpdate(user_id, query, { runValidators: true }, (err, user) => {

                  if(err || !user) {
                    utils.sendJsonError(res, "Updating passwork", 404);
                  }
                  else {
                      res.json({message: "Password updated"});
                  }
                });
            }
            else {
                if (err.name == 'TokenExpiredError'){
                    utils.sendJsonError(res, 'Reset token expired', 410);
                }
            }
        });
    }
    else if(!req.body.token) {
        utils.sendJsonError(res, 'reset token is required', 400);
    }
    else if (!req.body.newpass) {
        utils.sendJsonError(res, 'newpass is required', 400);
    }
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
