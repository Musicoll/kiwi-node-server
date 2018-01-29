//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

const test = require('tape');
let request = require('supertest');

const helper = require('./helper');
let server = require('../app');
let app = server.app;

let User = require('../app/models/User').User;
let TempUser = require('../app/models/User').TempUser

test('GET /api/users', t => {

  helper.clearDatabase();

  request(app).get('/api/users')
  .set('Accept', 'application/json')
  .expect(200)
  .expect('Content-Type', /json/)
  .end((err, res) => {
    t.ok(res.body instanceof Object, '/api/users endpoint ok');
    t.end(err);
  });

});

test('POST /api/users with no info provided should fail', t => {

  helper.clearDatabase();

  request(app).post('/api/users')
  .set('Accept', 'application/json')
  .send({})
  .expect(400)
  .expect('Content-Type', /json/)
  .end((err, res) => {
    t.error(err, 'request failed')
    t.ok(res.body.error === true, 'response has an error')
    t.end()
  });

});

test('Create a new user with only email provided should fail', t => {

  helper.clearDatabase();

  request(app).post('/api/users')
  .set('Accept', 'application/json')
  .send({email: helper.userTest.email})
  .expect(400)
  .expect('Content-Type', /json/)
  .end((err, res) => {
    t.error(err, 'request failed')
    t.ok(res.body.error === true, 'response has an error')
    t.end()
  });

});

test('Account activation standard scenario', t => {

    helper.clearDatabase();

    request(app).post('/api/users')
    .set('Accept', 'application/json')
    .send(helper.userTest)
    .expect('Content-Type', /json/)
    .end((err, res) => {

        t.error(err, 'user has been created')

        TempUser.findOne({email: helper.userTest.email}, function(err, user) {

            t.ok(user && !err, "good registration creates temp user");

            // Request with bad activation token should fail.
            let wrong_root = "/verify?tempuserid=" + user._id + "&token=" + user.activationToken + "34";

            request(app).get(wrong_root)
            .set('Accept', 'application/json')
            .expect(410)
            .expect('Content-Type', "text/html; charset=utf-8")
            .end((err, res) => {
            });

            // Request with good activation token.
            let root = "/verify?tempuserid=" + user._id + "&token=" + user.activationToken;

            request(app).get(root)
            .set('Accept', 'application/json')
            .expect(200)
            .expect('Content-Type', "text/html; charset=utf-8")
            .end((err, res) => {
                t.error(err, 'activation succeeds');

                // Activate twice should fail.
                request(app).get(root)
                .set('Accept', 'application/json')
                .expect(410)
                .expect('Content-Type', "text/html; charset=utf-8")
                .end((err, res) => {
                    t.end();
                });

            });
        });
    });
});

test('Account activation scenario reset information before validation', t => {

    helper.clearDatabase();

    request(app).post('/api/users')
    .set('Accept', 'application/json')
    .send(helper.userTest)
    .expect('Content-Type', /json/)
    .end((err, res) => {

        TempUser.findOne({email: helper.userTest.email}, function(err, user) {

            t.ok(user && !err, "good registration creates temp user");

            let old_root = "/verify?tempuserid=" + user._id + "&token=" + user.activationToken;

            let userTestModified = helper.userTest;
            userTestModified.username = 'johndoe2'

            // Reset temporary user.
            request(app).post('/api/users')
            .set('Accept', 'application/json')
            .send(userTestModified)
            .expect('Content-Type', /json/)
            .end((err, res) => {
                TempUser.findOne({username: userTestModified.username}, function(err, user2) {

                    t.ok(user2 && !err, "register again updates temporary user");

                    let new_root = "/verify?tempuserid=" + user2._id + "&token=" + user2.activationToken;

                    // Old user token early expired.
                    request(app).get(old_root)
                    .set('Accept', 'application/json')
                    .expect(410)
                    .expect('Content-Type', "text/html; charset=utf-8")
                    .end((err, res) => {
                    });

                    // New user token valid.
                    request(app).get(new_root)
                    .set('Accept', 'application/json')
                    .expect(200)
                    .expect('Content-Type', "text/html; charset=utf-8")
                    .end((err, res) => {
                        t.end()
                    });
                })
            });
        });
    });
});

test('Password must be hashed in database when creating a new user', t => {

  helper.clearDatabase();

  helper.createUser(helper.userTest, function(user) {

      const user_id = user._id

      User.findById(user_id)
      .select('+password')
      .then(user => {

        // test valid then invalid password:
        user.comparePassword(helper.userTest.password)
        .then(is_valid => {
          t.ok(is_valid, 'Comparing raw password with the hashed one must be equal')
        })
        .then(() => {
          user.comparePassword(helper.userTest.password + 'bad_pwd')
          .then(is_valid => {
            t.ok(!is_valid, 'Comparing bad raw password with the hashed one must NOT be equal')
            t.end()
          })
        })
      })
      .catch(error => {
        t.end(error)
      })
  });
});

test('GET /api/users/:id with an invalid ID should fail', t => {

  helper.clearDatabase();

  request(app).get('/api/users/' + '007')
  .set('Accept', 'application/json')
  .expect(404)
  .expect('Content-Type', /json/)
  .end((err, res) => {
    t.ok(res.body.error === true, '007 is not a valid user id');
    t.end(err)
  });

});

test('GET /api/users/:id', t => {

  helper.clearDatabase();

  helper.createUser(helper.userTest, function(newuser){

      request(app).get('/api/users/' + newuser._id)
      .set('Accept', 'application/json')
      .expect(200)
      .expect('Content-Type', /json/)
      .end((error, response) => {

        t.error(error, 'user infos can be retrieved with an ID')

        let user = response.body;

        t.ok('email' in user, "User has an 'email' property");
        t.ok('_id' in user, "User has an '_id' property");
        t.same(newuser._id, user._id, 'User ID match user creation ID')
        t.notOk('password' in user, "Password field is NOT returned");

        t.end()
      });
  });
});

test('DELETE /api/users/:id with a bad ID should fail', t => {

  helper.clearDatabase();

  const bad_user_id = 123456789;

  request(app).delete('/api/users/' + bad_user_id)
  .set('Accept', 'application/json')
  .expect(404)
  .expect('Content-Type', /json/)
  .end((err, res) => {
    t.ok(res.body.error === true, `/api/users/${bad_user_id} is not a valid user id`);
    t.end(err)
  });

});

test('DELETE /api/users/:id with a valid ID should pass', t => {

  helper.clearDatabase();

  helper.createUser(helper.userTest, function(newuser) {

      const user_id = newuser._id;

      request(app).delete('/api/users/' + user_id)
      .set('Accept', 'application/json')
      .expect(200)
      .expect('Content-Type', /json/)
      .end((error, response) => {

        t.ok(response.body.error === false, `user ${user_id} successfully deleted`);
        t.end()

      });
  });
});

test('Update a user with a bad id should fail', t => {

  helper.clearDatabase();

  const bad_user_id = 123456789;

  request(app).put('/api/users/' + bad_user_id)
  .set('Accept', 'application/json')
  .expect(404)
  .expect('Content-Type', /json/)
  .end((err, res) => {
    t.ok(res.body.error === true, `/api/users/${bad_user_id} is not a valid user id`);
    t.end(err)
  });

});

test('Updating email with a valid email should pass', t => {

  helper.clearDatabase();

  helper.createUser(helper.userTest, function(newuser) {

      const updated_user = {
        email: 'johny@gmail.com'
      }

      const user_id = newuser._id;

      request(app).put('/api/users/' + user_id)
      .set('Accept', 'application/json')
      .send(updated_user)
      .expect(200)
      .expect('Content-Type', /json/)
      .end((error, response) => {

        t.ok(response.body.error === false, `user ${user_id} successfully updated`);

        User.findById(user_id)
        .select('email')
        .then(user => {

          t.same(updated_user.email, user.email, "user email field has been updated")
          t.end()
        })
        .catch(error2 => {
          t.end(error2)
        })

      });
  });
});

test('Updating password with a valid ID should pass', t => {

  helper.clearDatabase();

  helper.createUser(helper.userTest, function(newuser){

      const updated_user = {
        password: 'newpassword'
      }

      const user_id = newuser._id;

      request(app).put('/api/users/' + user_id)
      .set('Accept', 'application/json')
      .send(updated_user)
      .expect(200)
      .expect('Content-Type', /json/)
      .end((error, response) => {
          t.ok(response.body.error === false, `user ${user_id} successfully updated`);

          User.findById(user_id)
          .select('+password')
          .then(user => {

              user.comparePassword(updated_user.password)
              .then(is_valid => {
                  t.ok(is_valid, 'Comparing raw password with the new hashed one must be equal')
                  t.end()
              })
          })
          .catch(error2 => {
              t.end(error2)
          })
      });
  });
});

test('GET /api/users/private should fail if token is not provided', t => {

  helper.clearDatabase();

  request(app).get('/api/users/private')
  .set('Accept', 'application/json')
  .expect(403)
  .expect('Content-Type', /json/)
  .end((err, res) => {

    t.error(err, 'Can NOT access to /api/users/private when no token provided')
    t.end(err)
  });

});

test('GET /api/users/private should fail with malformed token', t => {

  helper.clearDatabase();

  const invalid_token = '1234567890';

  request(app).get('/api/users/private')
  .set('Accept', 'application/json')
  .set('Authorization', 'JWT ' + invalid_token)
  .expect(403)
  .expect('Content-Type', /json/)
  .end((err, res) => {

    t.error(err, 'Can NOT access to /api/users/private with an invalid token')
    t.end(err)
  });

});

test('GET /api/users/private should fail if not token or token expired', t => {

    helper.clearDatabase();

    helper.createUser(helper.userTest, function(newuser){

        const user_id = newuser._id;

        request(app).get('/api/users/private')
        .set('Accept', 'application/json')
        .expect(403)
        .expect('Content-Type', /json/)
        .end((err3, res3) => {

          t.ok(res3.body.name == "NoAuthTokenError", "Error when no auth token provided");

          helper.createExpiredToken(user_id, function(token){

              request(app).get('/api/users/private')
              .set('Accept', '/application/json')
              .set('Authorization', 'JWT ' + token)
              .expect(403)
              .expect('Content-Type', /jon/)
              .end((err, res) => {
                  t.ok(res.body.name == "TokenExpiredError");
                  t.end();
              })
          })
        });
    })
});

test('GET /api/users/private should pass if a valid token id is provided', t => {

  helper.clearDatabase();

  helper.createUser(helper.userTest, function(newuser){

      const user_id = newuser._id;

      // get an API access token
      request(app).post('/api/login')
      .set('Accept', 'application/json')
      .send(helper.userTest)
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err2, res2) => {

        t.ok('user' in res2.body, 'has user')
        let user = res2.body.user;
        t.ok('token' in user, 'user has token')
        const token = user.token;

        request(app).get('/api/users/private')
        .set('Accept', 'application/json')
        .set('Authorization', 'JWT ' + token)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err3, res3) => {

          t.error(err3, 'Can NOT access to /api/users/private when no token provided')
          t.end()
        });

      });
  })
});

module.exports = test;
