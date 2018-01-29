let User = require('../app/models/User').User;
let PatcherDocument = require('../app/models/PatcherDocument');
let request = require('supertest');
let app = require('../app').app;
let TempUser = require('../app/models/User').TempUser
const jwt = require('jsonwebtoken');
const PRIVATE_KEY = require('config').private_key

const userTest = {
  username: 'johndoe',
  email: 'johndoe@gmail.com',
  password: 'password'
}

const userTest2 = {
    username: 'john deer',
    email: 'johndeer@gmail.com',
    password: 'password'
}

clearDatabase = () => {
  User.remove({}, err => {
    if(err) {
      console.error('User collection cannot be removed')
    }
  })

  PatcherDocument.remove({}, err => {
    if(err) {
      console.error('PatcherDocument collection cannot be removed')
    }
  })
}

createUser = function(user, next){

    request(app).post('/api/users')
    .set('Accept', 'application/json')
    .send(user)
    .expect('Content-Type', /json/)
    .end((err, res) => {

        TempUser.findOne({email: user.email}, function(err, tempuser) {

            // Request with good activation token.
            let root = "/verify?tempuserid=" + tempuser._id + "&token=" + tempuser.activationToken;

            request(app).get(root)
            .set('Accept', 'application/json')
            .expect(200)
            .expect('Content-Type', "text/html; charset=utf-8")
            .end((err, res) => {
                User.findOne({email: user.email}, function(err, newuser){
                    next(newuser);
                })
            });
        });
    })
};

loginUser = function(user, next){
    // get an API access token
    request(app).post('/api/login')
    .set('Accept', 'application/json')
    .send({
        username: user.username,
        password: user.password
    })
    .expect(200)
    .expect('Content-Type', /json/)
    .end((err2, res2) => {
        next(res2.body.user)
    });
}

createExpiredToken = function(user_id, next){

    let payload = {id: user_id}

    let token = jwt.sign(payload, PRIVATE_KEY, {
      expiresIn: '0'
    });

    next(token);
}

module.exports = {
  clearDatabase: clearDatabase,
  createUser: createUser,
  loginUser: loginUser,
  createExpiredToken: createExpiredToken,
  userTest: userTest,
  userTest2: userTest2
};
