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

module.exports = test;
