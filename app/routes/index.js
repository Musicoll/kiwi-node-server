
module.exports.setup = function(app) {

  // API routes
  app.use('/api', require('./api'));

  // Website routes
  app.use('/', require('./site'));
}
