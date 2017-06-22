//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

const test = require('tape');
let request = require('supertest');

const helper = require('./helper');
let server = require('../app');
let app = server.app;

let User = require('../app/models/User');

const userTest = {
  email: 'johndoe@gmail.com',
  password: 'password'
}

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
  .expect(206)
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
  .send({email: 'toto@gmail.com'})
  .expect(206)
  .expect('Content-Type', /json/)
  .end((err, res) => {
    t.error(err, 'request failed')
    t.ok(res.body.error === true, 'response has an error')
    t.end()
  });

});

test('POST /api/users with with valid email and password should pass', t => {

  helper.clearDatabase();

  request(app).post('/api/users')
  .set('Accept', 'application/json')
  .send(userTest)
  .expect(200)
  .expect('Content-Type', /json/)
  .end((err, res) => {
    t.error(err, 'user has been created')
    t.end()
  });

});

test('Password must be hashed in database when creating a new user', t => {

  helper.clearDatabase();

  request(app).post('/api/users')
  .set('Accept', 'application/json')
  .send(userTest)
  .expect(200)
  .expect('Content-Type', /json/)
  .end((err, res) => {
    t.error(err, 'user has been created')

    const user_id = res.body._id;

    User.findById(user_id)
    .select('+password')
    .then(user => {

      // test valid then invalid password:
      user.comparePassword(userTest.password)
      .then(is_valid => {
        t.ok(is_valid, 'Comparing raw password with the hashed one must be equal')
      })
      .then(() => {
        user.comparePassword(userTest.password + 'bad_pwd')
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
    t.ok(res.body.error === true, '/api/users/007 is not a valid user id');
    t.end(err)
  });

});

test('GET /api/users/:id', t => {

  helper.clearDatabase();

  request(app).post('/api/users')
  .set('Accept', 'application/json')
  .send(userTest)
  .expect(200)
  .expect('Content-Type', /json/)
  .end((err, res) => {
    t.error(err, 'user has been created')
    const user_id = res.body._id;

    request(app).get('/api/users/' + user_id)
    .set('Accept', 'application/json')
    .expect(200)
    .expect('Content-Type', /json/)
    .end((error, response) => {

      t.error(error, 'user infos can be retrieved with an ID')

      t.ok('email' in response.body, "User has an 'email' property");
      t.ok('_id' in response.body, "User has an '_id' property");
      t.same(user_id, res.body._id, 'User ID match user creation ID')
      t.notOk('password' in response.body, "Password field is NOT returned");

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

  request(app).post('/api/users')
  .set('Accept', 'application/json')
  .send(userTest)
  .expect(200)
  .expect('Content-Type', /json/)
  .end((err, res) => {

    const user_id = res.body._id;
    t.error(err, `user ${user_id} created`)

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

  request(app).post('/api/users')
  .set('Accept', 'application/json')
  .send(userTest)
  .expect(200)
  .expect('Content-Type', /json/)
  .end((err, res) => {

    const updated_user = {
      email: 'johny@gmail.com'
    }

    const user_id = res.body._id;
    t.error(err, `user ${user_id} created`)

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

  request(app).post('/api/users')
  .set('Accept', 'application/json')
  .send(userTest)
  .expect(200)
  .expect('Content-Type', /json/)
  .end((err, res) => {

    const updated_user = {
      password: 'newpassword'
    }

    const user_id = res.body._id;
    t.error(err, `user ${user_id} created`)

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

test('GET /api/users/private should fail if token is not valid', t => {

  helper.clearDatabase();

  const invalid_token = 1234567890;

  request(app).get('/api/users/private')
  .set('Accept', 'application/json')
  .send({'token': invalid_token})
  .expect(403)
  .expect('Content-Type', /json/)
  .end((err, res) => {

    t.error(err, 'Can NOT access to /api/users/private with an invalid token')
    t.end(err)
  });

});

test('GET /api/users/private should pass if a valid token id provided', t => {

  helper.clearDatabase();

  request(app).post('/api/users')
  .set('Accept', 'application/json')
  .send(userTest)
  .expect(200)
  .expect('Content-Type', /json/)
  .end((err, res) => {
    const user_id = res.body._id;
    t.error(err, `user ${user_id} has been created`)

    // get an API access token
    request(app).post('/api/auth')
    .set('Accept', 'application/json')
    .send(userTest)
    .expect(200)
    .expect('Content-Type', /json/)
    .end((err2, res2) => {

      t.ok('token' in res2.body, 'token has been created')
      const token = res2.body.token;

      request(app).get('/api/users/private')
      .set('Accept', 'application/json')
      .send({'token': token})
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err3, res3) => {

        t.error(err3, 'Can NOT access to /api/users/private when no token provided')
        t.end()
      });

    });

  });

});

module.exports = test;
