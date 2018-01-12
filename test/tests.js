//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

const test = require('tape');
let request = require('supertest');
let mongoose = require('mongoose');

let server = require('../app');
let app = server.app;

test('setup', t => {
  server.connectDataBase(err => {
    t.end(err);
  })
});

let site_tests = require('./site');
site_tests();

let api_tests = require('./api');
api_tests();

let users_tests = require('./users');
users_tests();

let documents_tests = require('./documents');
documents_tests();

// let releases_tests  = require('./releases')
// releases_tests();

test('teardown', t => {
  mongoose.connection.close(err => {
    t.end()
  })
});
