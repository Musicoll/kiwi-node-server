//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

const test = require('tape');
let request = require('supertest');

const helper = require('./helper');
let server = require('../app/app');
let app = server.app;

let User = require('../models/User');

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

module.exports = test;
