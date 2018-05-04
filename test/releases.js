//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

const kiwi_version = require('config').kiwi_version

const test = require('tape');
let request = require('supertest');

let server = require('../app');
let app = server.app;

test('GET /api/releass', t => {

  request(app).get('/api/releases')
  .accept('application/json')
  .expect(200)
  .type('application/json')
  .end((err, res) => {
    t.ok(res.body["release"], "release contains version name");
    t.ok(res.body["release"] == kiwi_version, "release shoul match config info");
    t.end(err);
  });

});

module.exports = test;
