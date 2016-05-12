var bodyParser = require('body-parser');
// var loanController = require('./loans/loan_controller.js');
var path = require('path');

module.exports = function(app, express) {

  var router = express.Router();

  app.use( express.static( path.join( __dirname, '../public/views' ) ) );

  app.use( '/scripts', express.static( __dirname + '../../node_modules') );

  app.use( '/libs', express.static( __dirname + '../../node_modules') );

  app.use( '/js', express.static( __dirname + '../../public/js') );

  app.use( bodyParser.json() );

  app.use('/api/v0', router);
};

