// Load packages
let path = require('path');
let express = require('express');
let bodyParser = require('body-parser');
let config = require('config');
let db = require('./db');
let expressVue = require('express-vue');
let app = express();

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// set the view engine
app.set('vue', {
  componentsDir: path.join(__dirname, '../views/components'),
  defaultLayout: 'layout'
});

app.set('views', path.join(__dirname, '../views'));
app.engine('vue', expressVue);
app.set('view engine', 'vue');

// set the public directory to serve from static ressources
app.use('/assets', express.static(__dirname + '/../public'));

// Website routes
app.use('/', require('../routes/site/index'));

// API routes
app.use('/api', require('../routes/api/api'));

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

connectDataBase = (done) => {
  db.connect(err => {
    typeof done === 'function' && done(err)
  })
}

// Start server (only if this file has been called directly)
startServer = (done) => {
  return app.listen(config.port, function () {
    console.log('Kiwi server listening on port : ' + config.port)
    typeof done === 'function' && done()
  })
}

module.exports = {
  connectDataBase: connectDataBase,
  startServer: startServer,
  app: app
}
