//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

let PatcherDocument = require('../models/PatcherDocument');

//Require the dev-dependencies
const test = require('tape');
let request = require('supertest');

let mongoose = require('mongoose');

let server = require('../app/app');
let app = server.app;

test('setup', function(t) {
  server.connectDataBase(err => {
    t.end(err);
  })
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

test('GET /api/documents/:id with a bad id', t => {

  request(app).get('/api/documents/badid')
  .set('Accept', 'application/json')
  .expect(404)
  .expect('Content-Type', /json/)
  .end((err, res) => {
    t.ok(res.body.error === true, '/api/documents/badid is not a valid document id')
    t.end(err);
  });

});

test('GET /api/documents/:id', t => {

  request(app).post('/api/documents')
  .set('Accept', 'application/json')
  .send({name: 'toto.kiwi'})
  .expect(200)
  .expect('Content-Type', /json/)
  .end((err, res) => {

    let doc = res.body;

    request(app).get('/api/documents/' + doc._id)
    .set('Accept', 'application/json')
    .expect(200)
    .expect('Content-Type', /json/)
    .end((error, response) => {
      t.same(doc, response.body, 'document can be retrieved by id');
      t.end(err);
    });
  });

});

test('delete a document with a bad id should fail', t => {

  const bad_id = 'zozo';
  request(app).delete('/api/documents/' + bad_id)
  .set('Accept', 'application/json')
  .expect(404)
  .expect('Content-Type', /json/)
  .end((error, response) => {
    t.ok(response.body.error === true, `document with id '${bad_id}' can not be deleted`)
    t.end(error);
  });

});

test('DELETE /api/documents/:id', t => {

  request(app).post('/api/documents')
  .set('Accept', 'application/json')
  .send()
  .expect(200)
  .expect('Content-Type', /json/)
  .end((err, res) => {

    let doc = res.body;

    t.error(err, `document ${doc._id} created`)

    request(app).delete('/api/documents/' + doc._id)
    .set('Accept', 'application/json')
    .expect(200)
    .expect('Content-Type', /json/)
    .end((error, response) => {
      t.ok(response.body.error === false, `document ${doc._id} has been successfully deleted`)
      t.end(error);
    });
  });

});

test('update a document with a bad id should fail', t => {

  const bad_id = 'zozo';
  request(app).put('/api/documents/' + bad_id)
  .set('Accept', 'application/json')
  .send({name: 'toto.kiwi'})
  .expect(404)
  .expect('Content-Type', /json/)
  .end((error, response) => {
    t.ok(response.body.error === true, `document with id '${bad_id}' can not be updated`)
    t.end(error);
  });

});

test('PUT /api/documents/:id', t => {

  const old_name = 'toto.kiwi';
  const new_name = 'tata.kiwi';

  request(app).post('/api/documents')
  .set('Accept', 'application/json')
  .send({name: old_name})
  .expect(200)
  .expect('Content-Type', /json/)
  .end((err, res) => {

    let doc = res.body;

    t.error(err, `document ${doc._id} created`)

    request(app).put('/api/documents/' + doc._id)
    .set('Accept', 'application/json')
    .send({name: new_name})
    .expect(200)
    .expect('Content-Type', /json/)
    .end((error, response) => {
      t.ok(response.body.error === false, `document ${doc._id} has been successfully updated`)

      request(app).get('/api/documents/' + doc._id)
      .expect(200)
      .expect('Content-Type', /json/)
      .end((error2, response2) => {
        t.same(response2.body.name, new_name, `document name has been successfully updated`)
        t.end(error2);
      });
    });

  });

});

test('teardown', function(t){
  mongoose.connection.close(function(err) {
    t.end()
  })
});
