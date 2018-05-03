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

/**
 * @api {get} /users Get a list of users.
 * @apiName GetUsers
 * @apiGroup Users
 * @apiVersion 1.0.0
 *
 * @apiHeader {String} ids A list of user identifiers (optional).
 *
 * @apiSuccess {Array} array A list of users.
 *
 * @apiSuccessExample Success-Response:
 *[
 *     {
 *         "_id": "1EE1DF05798F66B7",
 *         "username": "jean-millot-dev",
 *         "email": "jean_millot@hotmail.com",
 *         "__v": 0,
 *         "createdAt": "2018-04-26T14:00:05.754Z"
 *     },
 *     {
 *         "_id": "5A2AD92CA3A5D91E",
 *         "username": "jean-millot",
 *         "email": "jean.millot7@gmail.com",
 *         "__v": 0,
 *         "createdAt": "2018-04-26T15:00:34.648Z"     }
 * ]
 *
 *
 */
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

/**
 * @api {post} /users Create a temporary user.
 * @apiName CreateUser
 * @apiGroup Users
 * @apiVersion 1.0.0
 * @apiDescription Create a temporary user and send an email with validation link.
 *
 * @apiParam {String} email The user email adress.
 * @apiParam {String} username The user name.
 * @apiParam {String} password User password.
 *
 * @apiSuccessExample Success-Response:
 *{
 *     "message": "Activation mail sent"
 *}
 *
 */
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

/**
 * @api {post} /users/passtoken Request reset password.
 * @apiName PasswordToken
 * @apiGroup Users
 * @apiVersion 1.0.0
 * @apiDescription Send an email to user with a reset password token.
 *
 * @apiParam {String} email The user email adress.
 *
 * @apiSuccessExample Success-Response:
 *{
 *     "message": "Reset password sent"
 *}
 *
 */
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

/**
 * @api {post} /users/passreset Reset user password.
 * @apiName PasswordToken
 * @apiGroup Users
 * @apiVersion 1.0.0
 * @apiDescription Update the user password with given token.
 *
 * @apiParam {String} token The token send by mail.
 * @apiParam {String} newpass The new users's password.
 *
 * @apiSuccessExample Success-Response:
 *{
 *     "message": "Password updated"
 *}
 *
 */
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

/**
 * @api {get} /users/:id Get information about a user.
 * @apiName GetUser
 * @apiGroup Users
 * @apiVersion 1.0.0
 * @apiDescription Return informations of specified user.
 *
 * @apiParam {String} id The user identifier.
 *
 * @apiSuccessExample Success-Response:
 * {
 *     "_id": "1EE1DF05798F66B7",
 *     "username": "jean-millot-dev",
 *     "email": "jean_millot@hotmail.com",
 *     "__v": 0,
 *     "createdAt": "2018-04-26T14:00:05.754Z"
 * }
 *
 */
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

module.exports = router;
