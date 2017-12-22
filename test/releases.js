//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

const test = require('tape');
let request = require('supertest');

let server = require('../app');
let app = server.app;

test('GET /api/releases', t => {

  request(app).get('/api/releases')
  .accept('application/json')
  .expect(200)
  .type('application/json')
  .end((err, res) => {
      let releases = res.body;
      t.ok(Array.isArray(releases), "releases is an array");
      t.end(err);
  });
});

test('GET /api/releases/latest', t => {

  request(app).get('/api/releases/latest')
  .accept('application/json')
  .expect(200)
  .type('application/json')
  .end((err, res) => {
    let latest = res.body;
    t.ok(latest["tag_name"], "latest release has a 'tag_name' property");
    t.ok(latest["url"], "latest release has a 'url' property");
    t.ok(latest["id"], "latest release has a 'id' property");
    t.end(err);
  });

});

module.exports = test;
