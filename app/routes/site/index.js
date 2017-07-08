const router = require('express').Router();

class GlobalScope {
  constructor(req) {
    this.data = {
      title: 'Kiwi',
    };

    this.vue = {
      head: {
        title: 'Kiwi',
        meta: []
      }
    }
  }
}

// GET the home page
router.get('/', function(req, res) {
  let scope = new GlobalScope(req);
  scope.data.title = 'Kiwi Home page';
  scope.vue.head.title = "Home";
  scope.vue.components = ['mainMenu'];
  res.render('index', scope);
});

// GET a 404 error page for all other routes
router.all('/*', function(req, res, next) {
  let scope = new GlobalScope(req);
  scope.data.title = 'Page not found';
  scope.vue.head.title = "Page not found";
  scope.vue.components = ['mainMenu'];
  res.status(404).render('notFound', scope)
});

module.exports = router;
