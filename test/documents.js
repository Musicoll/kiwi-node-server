//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

let PatcherDocument = require('../models/PatcherDocument');

//Require the dev-dependencies
const test = require('tape');
let request = require('supertest');

let mongoose = require('mongoose');

let server = require('../app/app');
let app = server.app;

const util = require('util')

test('setup', function(t) {
  server.connectDataBase(err => {
    t.end(err);
  })
});

test('GET /api', t => {

  request(app).get('/api/documents')
  .set('Accept', 'application/json')
  .expect(200)
  .expect('Content-Type', /json/)
  .end((err, res) => {
    t.ok(res.body instanceof Object, '/api endpoint ok');
    t.end(err);
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

test('GET /api/documents', t => {

  request(app).get('/api/documents')
  .set('Accept', 'application/json')
  .expect(200)
  .expect('Content-Type', /json/)
  .end((err, res) => {
    t.ok(res.body instanceof Object, '/api/documents endpoint ok');
    t.end(err);
  });

});

test('POST /api/documents', t => {

  request(app).post('/api/documents')
  .set('Accept', 'application/json')
  .send({name: 'toto.kiwi'})
  .expect(200)
  .expect('Content-Type', /json/)
  .end((err, res) => {
    let doc = res.body;
    t.ok('name' in doc, "document has a 'name' property");
    t.ok(doc.name == "toto.kiwi", "document name has been set");
    t.ok('_id' in doc, "document has an '_id' property");
    t.ok('updated_at' in doc, "document has an 'updated_at' property");
    t.end(err);
  });

});

test('teardown', function(t){
  mongoose.connection.close()
  t.end();
});
