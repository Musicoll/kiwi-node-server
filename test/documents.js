//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

let PatcherDocument = require('../models/PatcherDocument');

//Require the dev-dependencies
const test = require('tape');
let request = require('supertest');

let mongoose = require('mongoose');

let server = require('../server');
let app = server.app;

const util = require('util')

test('setup', function(t) {
  server.start(err => {
    t.end(err);
  })
});

test('GET /api', t => {

  request(app)
  .get('/api/documents')
  .expect(200)
  .expect('Content-Type', /json/)
  .end((err, res) => {
    t.ok(res instanceof Object, '/api endpoint ok');
    t.end(err);
  });

});

test('GET /api/documents', t => {

  request(app)
  .get('/api/documents')
  .expect(200)
  .expect('Content-Type', /json/)
  .end((err, res) => {
    t.ok(res instanceof Object, '/api/documents endpoint ok');
    t.end(err);
  });

});

test('POST /api/documents', t => {

  request(app).post('/api/documents')
  .send({name: 'toto.kiwi'})
  .expect(200)
  .expect('Content-Type', /json/)
  .end((err, res) => {
    
    t.ok(res.body.name == "toto.kiwi", "document name is ok");
    t.end(err);
  });

});

test('teardown', function(t){
  mongoose.connection.close()
  t.end();
});
