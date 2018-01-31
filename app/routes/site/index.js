const router = require('express').Router();
const TempUser = require('../../models/User').TempUser
const User = require('../../models/User').User

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

// GET the user validation page
router.get('/verify', function(req, res){

    const tempuserid = req.query.tempuserid;
    const activationToken = req.query.token;

    if (!tempuserid || !activationToken) {
        res.status(400).render('simpleMessage', {data: {mess: "Id or Token not specified"}});
        return
    }

    TempUser.findOne({_id: req.query.tempuserid}, function (err, tempuser) {

        if (!tempuser || activationToken != tempuser.activationToken) {
            res.status(410).render('simpleMessage', {data: {mess: "Activation expired. Please register again."}})
        }
        else if(err) {
            res.status(500).render('simpleMessage', {data: {mess: "Activation failed"}});
        }
        else {

            let newUser = new User({username: tempuser.username,
                                    email: tempuser.email,
                                    password: tempuser.password
            });

            newUser.save((err, user) => {
                if (err || !user) {
                    res.status(500).render('simpleMessage', {data: {mess: "Activation failed."}});
                }
                else {
                    res.render('simpleMessage', {data:{mess: "Your account has been confirmed."}})
                }
            });

            TempUser.remove({_id: tempuser._id}, function(err) {
            });
        }
    });
})

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
