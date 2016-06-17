var path = require('path');

module.exports = function(app, express) {

  var router = express.Router();

  app.use(express.static( path.join( __dirname, '../public' )));

  app.use('/scripts', express.static( __dirname + '/../node_modules'));

  app.use('/libs', express.static( __dirname + '/../node_modules'));

  app.use('/api/v0', router);
};

