//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

const test = require('tape');
let request = require('supertest');

let server = require('../app');
let app = server.app;

test('GET site home page', t => {

  request(app).get('/')
  .expect(200)
  .expect('Content-Type', /html/)
  .end((err, res) => {
    t.error(err, 'Get the homepage with no errors')
    t.end();
  });

});

test('Test 404 error HTML page note found', t => {

  request(app).get('/zozo/45')
  .expect(404)
  .expect('Content-Type', /html/)
  .end((err, res) => {
    t.error(err, '/zozo/45 returns a 404 error html page')
    t.end();
  });

});

test('Start and close server', t => {

  t.test('Start server', st => {

    server.startServer(done => {
      st.ok(true, 'the server is running');
      st.end()
    })

  });

  t.test('Stop Server', st => {

    server.closeServer(done => {
      st.ok(true, 'the server is closed');
      st.end()
    })

  });

  t.end()

});

module.exports = test;
