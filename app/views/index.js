let path = require('path');

module.exports.setup = function(app) {

  // set the view engine
  app.set('vue', {
    componentsDir: path.join(__dirname, './components'),
    defaultLayout: 'layout'
  });

  app.set('views', path.join(__dirname, './'));
  app.engine('vue', require('express-vue'));
  app.set('view engine', 'vue');

}
