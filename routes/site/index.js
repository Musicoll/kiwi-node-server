let express = require('express');
let router = express.Router();

// here
router.use(function(req, res, next) {
  //console.log('User-Agent: ' + req.get('User-Agent'));
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

module.exports = router;
