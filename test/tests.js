//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

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

let site_tests = require('./site');
site_tests();

let api_tests = require('./api');
api_tests();

let users_tests = require('./users');
users_tests();

let documents_tests = require('./documents');
documents_tests();

test('teardown', function(t){
  mongoose.connection.close(function(err) {
    t.end()
  })
});
