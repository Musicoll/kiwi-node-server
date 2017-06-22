let express = require('express');
let router = express.Router();
let util = require('util');

// here
router.use(function(req, res, next) {
  //console.log('User-Agent: ' + req.get('User-Agent'));
  //console.log(util.inspect(req, false, null));
  next();
});

const authMixin = require('./auth');

// GET the home page
router.get('/', function(req, res) {
    let scope = {
        data: {
            title: 'Kiwi Home page'
        },
        vue: {
            head: {
                title: 'Home'
            },
            components: ['mainMenu'],
            mixins: [authMixin]
        }
    }

    res.render('index', scope);
});

// GET the login page
router.get('/login', function(req, res){
    let scope = {
        data: {
            title: 'Login',
            active: 'login',
        },
        vue: {
            head: {
                title: 'Login',
            },
            components: ['mainMenu'],
            mixins: [authMixin]
        }
    }

    res.render('login', scope);
});

// GET the login page
router.get('/join', function(req, res){
    let scope = {
        data: {
            title: 'Register',
            active: 'register'
        },
        vue: {
            head: {
                title: 'Register'
            },
            components: ['mainMenu'],
            mixins: [authMixin]
        }
    }

    res.render('login', scope);
});

// GET the dashboard page
// Redirect to login page if the user isn't logged
router.get('/dashboard', function(req, res) {
    let scope = {
        data: {
            title: 'Kiwi Dashboard'
        },
        vue: {
            head: {
                title: 'Kiwi Dashboard'
            },
            components: ['mainMenu']
        }
    }

    let logged = false;

    if(logged) {
      res.render('dashboard', scope);
    }
    else {
      res.status(302).redirect('/login?url=' + req.originalUrl);
    }
});

// GET a 404 error page for all other routes
router.all('/*', function(req, res, next) {

    var scope = {
        data: { title: 'Page not found' },
        vue: {
          head: { title: 'Page not found' },
          components: ['mainMenu'],
          mixins: [authMixin]
        }
    };

    res.status(404).render('notFound', scope)
});

module.exports = router;
