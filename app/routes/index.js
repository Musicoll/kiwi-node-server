
module.exports.setup = function(app) {

  // Website routes
  app.use('/', require('./site'));

  // API routes
  app.use('/api', require('./api'));

  // GET a 404 error page for all other routes
  app.all('/*', function(req, res, next) {

      var scope = {
          data: { title: 'Page not found' },
          vue: {
            head: { title: 'Page not found' },
            components: ['mainMenu']
          }
      };

      res.status(404).render('notFound', scope)

  });
}
