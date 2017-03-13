let express = require('express');
let router = express.Router();

// GET the home page
router.get('/', function(req, res, next) {
  res.render('pages/index', {title: 'Home'})
});

module.exports = router;
