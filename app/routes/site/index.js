let express = require('express');
let router = express.Router();
let util = require('util');
let passport = require('passport');
const auth = require('../../authenticate');

// here we could check if the request came from a browser or from kiwi the embed browser
/*
router.use(function(req, res, next) {
  //console.log('User-Agent: ' + req.get('User-Agent'));
  //console.log(util.inspect(req, false, null));
  next();
});
*/

class GlobalScope {
  constructor(req) {
    this.data = {
      title: 'Kiwi',
      user: {
        authenticated: req.isAuthenticated()
      }
    };

    if(req.user) {
      Object.assign(this.data.user, req.user.toObject());
    }

    this.vue = {
      head: {
        title: '',
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

// GET the login page
router.get('/login', function(req, res){

  if(req.isAuthenticated()) {
    return res.redirect('/');
  }

  let scope = new GlobalScope(req);
  scope.data.title = 'Login';
  scope.data.active = 'login';
  scope.vue.head.title = "Login";
  scope.vue.components = ['mainMenu'];
  res.render('login', scope);
});

// POST login
router.post('/login', function(req, res, next) {

  passport.authenticate('local', function(err, user, info) {

    if (err) {
      return next(err);
    }

    if (!user) {
      //req.flash('errors', info);
      return res.redirect('/login');
    }

    req.logIn(user, err => {
      if (err) {
        return next(err);
      }
      res.redirect('/');
    });

  })(req, res, next);

});

// GET the login page
router.get('/join', function(req, res){
  let scope = new GlobalScope(req);
  scope.data.title = 'Register';
  scope.data.active = 'register';
  scope.vue.head.title = "Register";
  scope.vue.components = ['mainMenu'];
  res.render('login', scope);
});

// POST /users
router.post('/join', function(req, res) {
  /*
  let newuser = new User(req.body);

  newuser.save()
  .then(user => { res.json(user) })
  .catch(err => {
  console.log(`Creating new user failed : ${err.message}`);
  //console.log(util.inspect(user));
  if('email' in err.errors)
  {
  utils.sendJsonError(res, `${err.errors.email.message}`, 206);
}
else if('password' in err.errors)
{
utils.sendJsonError(res, `${err.errors.password.message}`, 206);
}
else {
utils.sendJsonError(res, `Creating new user failed`, 500);
}
})
*/
});

// GET the login page
router.get('/logout', function(req, res) {
  req.logout();
  // req.flash('info', { msg: 'You have successfully logged out.' });
  res.redirect('/');
});

// GET the dashboard page
// Redirect to login page if the user isn't logged
router.get('/dashboard', auth.isAuthenticated, function(req, res) {
  let scope = new GlobalScope(req);
  scope.data.title = 'Kiwi Dashboard';
  scope.vue.head.title = "Kiwi Dashboard";
  scope.vue.components = ['mainMenu'];
  res.render('dashboard', scope);
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
