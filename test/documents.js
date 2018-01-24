//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

const test = require('tape');
let request = require('supertest');

const helper = require('./helper');
let server = require('../app');
let app = server.app;

test('GET /api/documents', t => {

  helper.clearDatabase();

  request(app).get('/api/documents')
  .accept('application/json')
  .expect(403)
  .type('application/json')
  .end((err, res) => {
      t.error(err, "Getting documents wihtout login should fail");
  });

  helper.createUser(helper.userTest, function(newuser){
      helper.loginUser(helper.userTest, function(loginuser){
          request(app).get('/api/documents')
          .set('Authorization', 'JWT ' + loginuser.token)
          .accept('application/json')
          .expect(200)
          .type('application/json')
          .end((err, res) => {
              t.error(err, "Getting documents with login should succeed");
              t.end()
          });
      })
  })

});

test('POST /api/documents', t => {

  helper.clearDatabase();

  request(app).post('/api/documents')
  .accept('application/json')
  .send({name: 'toto.kiwi'})
  .expect(403)
  .type('application/json')
  .end((err, res) => {
      t.error(err, "Creating documents without login should fail");
  });

  helper.createUser(helper.userTest, function(newuser){
      helper.loginUser(helper.userTest, function(loginuser){
          request(app).post('/api/documents')
          .set('Authorization', 'JWT ' + loginuser.token)
          .accept('application/json')
          .send({name: 'toto.kiwi'})
          .expect(200)
          .type('application/json')
          .end((err, res) => {
            let doc = res.body;
            t.ok('name' in doc, "document has a 'name' property");
            t.ok(doc.name == "toto.kiwi", "document name has been set");
            t.ok('_id' in doc, "document has an '_id' property");
            t.ok('session_id' in doc, "document has a 'session_id' property");
            t.ok('createdBy' in doc, "document has a createdBy property")
            t.end(err);
          });
      })
  })

});

test('POST /api/documents with an empty name param should set the document title to Untitled', t => {

  helper.clearDatabase();

  helper.createUser(helper.userTest, function(newuser){
      helper.loginUser(helper.userTest, function(loginuser){
          request(app).post('/api/documents')
          .set('Authorization', 'JWT ' + loginuser.token)
          .accept('application/json')
          .send({name: ''})
          .expect(200)
          .type('application/json')
          .end((err, res) => {
              t.error(err, "Creating document should succeed")
              t.ok(res.body.name == "Untitled", "Document name shoudl be Untitled");
              t.end()
          });
      })
  })

});

test('GET /api/documents/:id with a bad id', t => {

  helper.clearDatabase();

  helper.createUser(helper.userTest, function(newuser){
      helper.loginUser(helper.userTest, function(loginuser){
          request(app).get('/api/documents/badid')
          .set('Authorization', 'JWT ' + loginuser.token)
          .accept('application/json')
          .expect(404)
          .type('application/json')
          .end((err, res) => {
            t.ok(res.body.error === true, '/api/documents/badid is not a valid document id')
            t.end(err);
          });
      })
  })

});

test('GET /api/documents/:id', t => {

  helper.clearDatabase();

  helper.createUser(helper.userTest, function(newuser){
      helper.loginUser(helper.userTest, function(loginuser){

          request(app).post('/api/documents')
          .set('Authorization', 'JWT ' + loginuser.token)
          .accept('application/json')
          .send({name: 'toto.kiwi'})
          .expect(200)
          .type('application/json')
          .end((err, res) => {

            let doc = res.body;

            request(app).get('/api/documents/' + doc._id)
            .accept('application/json')
            .expect(403)
            .type('application/json')
            .end((error, response) => {
                t.error(error, "Get document should fail witout authentification")
            });

            request(app).get('/api/documents/' + doc._id)
            .set('Authorization', 'JWT ' + loginuser.token)
            .accept('application/json')
            .expect(200)
            .type('application/json')
            .end((error, response) => {
                t.same(doc, response.body, 'document can be retrieved by id');
                t.end();
            });
          });
      })
  })

});

// test('delete a document with a bad id should fail', t => {
//
//   helper.clearDatabase();
//
//   const bad_id = 'zozo';
//   request(app).delete('/api/documents/' + bad_id)
//   .accept('application/json')
//   .expect(404)
//   .type('application/json')
//   .end((error, response) => {
//     t.ok(response.body.error === true, `document with id '${bad_id}' can not be deleted`)
//     t.end(error);
//   });
//
// });

// test('DELETE /api/documents/:id', t => {
//
//   helper.clearDatabase();
//
//   request(app).post('/api/documents')
//   .accept('application/json')
//   .send()
//   .expect(200)
//   .type('application/json')
//   .end((err, res) => {
//
//     let doc = res.body;
//
//     t.error(err, `document ${doc._id} created`)
//
//     request(app).delete('/api/documents/' + doc._id)
//     .accept('application/json')
//     .expect(200)
//     .type('application/json')
//     .end((error, response) => {
//       t.ok(response.body.error === false, `document ${doc._id} has been successfully deleted`)
//       t.end(error);
//     });
//   });
//
// });
//
// test('update a document with a bad id should fail', t => {
//
//   helper.clearDatabase();
//
//   const bad_id = 'zozo';
//   request(app).put('/api/documents/' + bad_id)
//   .accept('application/json')
//   .send({name: 'toto.kiwi'})
//   .expect(404)
//   .type('application/json')
//   .end((error, response) => {
//     t.ok(response.body.error === true, `document with id '${bad_id}' can not be updated`)
//     t.end(error);
//   });
//
// });

test('PUT /api/documents/:id', t => {

  helper.clearDatabase();

  const old_name = 'toto.kiwi';
  const new_name = 'tata.kiwi';

  helper.createUser(helper.userTest, function(newuser){
      helper.loginUser(helper.userTest, function(loginuser){

          request(app).post('/api/documents')
          .accept('application/json')
          .set('Authorization', 'JWT ' + loginuser.token)
          .send({name: old_name})
          .expect(200)
          .type('application/json')
          .end((err, res) => {

            let doc = res.body;

            t.error(err, `document ${doc._id} created`)

            request(app).put('/api/documents/' + doc._id)
            .accept('application/json')
            .send({name: new_name})
            .expect(403)
            .type('application/json')
            .end((error, response) => {
                t.error(error, "Put without authentication should fail");
            })

            request(app).put('/api/documents/' + doc._id)
            .set('Authorization', 'JWT ' + loginuser.token)
            .accept('application/json')
            .send({name: new_name})
            .expect(200)
            .type('application/json')
            .end((error, response) => {
              t.ok(response.body.error === false, `document ${doc._id} has been successfully updated`)

              request(app).get('/api/documents/' + doc._id)
              .set('Authorization', 'JWT ' + loginuser.token)
              .expect(200)
              .type('application/json')
              .end((error2, response2) => {
                t.same(response2.body.name, new_name, `document name has been successfully updated`)

                request(app).put('/api/documents/' + doc._id)
                .set('Authorization', 'JWT ' + loginuser.token)
                .accept('application/json')
                .send({createdBy: "3C65373959"})
                .expect(400)
                .type('application/json')
                .end((error, response) => {
                    t.error(error, "Updating createdBy field should fail");
                    helper.clearDatabase();
                    t.end(error);
                });
              });
            });

          });

      })
  })

});

module.exports = test;
