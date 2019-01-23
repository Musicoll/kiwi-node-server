const router = require("express").Router();
const TempUser = require("../../models/User").TempUser;
const User = require("../../models/User").User;

// GET the user validation page
router.get("/verify", function(req, res) {
  const tempuserid = req.query.tempuserid;
  const activationToken = req.query.token;

  if (!tempuserid || !activationToken) {
    data.message = "Id or Token not specified";
    res.status(400).renderVue(vue, data, req.vueOptions);
    return;
  }

  const vue = "simpleMessage.vue";
  let data = {
    title: `Kiwi`,
    error: true,
    message: "Error"
  };

  TempUser.findOne({ _id: req.query.tempuserid }, function(err, tempuser) {
    if (!tempuser || activationToken != tempuser.activationToken) {
      data.message =
        "Activation expired. Please click on the latest link you received or register again";
      res.status(410).renderVue(vue, data, req.vueOptions);
    } else if (err) {
      data.message = "Error";
      res.status(500).renderVue(vue, data, req.vueOptions);
    } else {
      User.create(
        {
          username: tempuser.username,
          email: tempuser.email,
          password: tempuser.password
        },
        (err, user) => {
          if (err || !user) {
            data.message = "Error";
            res.status(500).renderVue(vue, data, req.vueOptions);
          } else {
            user.save(function(err, user) {
              if (err || !user) {
                data.message = "Error";
                res.status(500).renderVue(vue, data, req.vueOptions);
              } else {
                data.error = false;
                data.message = "Your account has been confirmed.";
                res.renderVue(vue, data, req.vueOptions);
                return;
              }
            });
          }
        }
      );

      TempUser.deleteOne({ _id: tempuser._id }, function(err) {});
    }
  });
});

// GET the home page
router.get("/", (req, res) => {
  const data = {
    title: `Kiwi Home page`
  };

  req.vueOptions = {
    head: {
      title: `Home`
    }
  };

  res.renderVue("index.vue", data, req.vueOptions);
});

// GET a 404 error page for all other routes
router.all("/*", (req, res, next) => {
  const data = {
    title: `Page ${req.originalUrl} not found`
  };

  req.vueOptions = {
    head: {
      title: data.title
    }
  };

  res.status(404).renderVue("notFound.vue", data, req.vueOptions);
});

module.exports = router;
