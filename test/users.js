//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

const test = require('tape');
let request = require('supertest');
let server = require('../app/app');
let app = server.app;

test('GET /api/users', t => {

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

module.exports = test;
