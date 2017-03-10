//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

const test = require('tape');
let request = require('supertest');

let server = require('../app/app');
let app = server.app;

test('GET /api', t => {

  request(app).get('/api')
  .set('Accept', 'application/json')
  .expect(200)
  .expect('Content-Type', /json/)
  .end((err, res) => {
    t.error(err, 'Get the /api endpoint with no errors')
    //t.ok(res.body instanceof Object, '/api endpoint ok');
    t.end();
  });

});

test('GET /api invalid path error', t => {

  request(app).get('/api/toto')
  .set('Accept', 'application/json')
  .expect(404)
  .expect('Content-Type', /json/)
  .end((err, res) => {
    t.ok(res.body.error === true, '/api/toto is an invalid api path')
    t.end(err);
  });

});
