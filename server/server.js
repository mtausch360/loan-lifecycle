var express = require('express');
var path = require('path');
var app = express();
require('./middleware.js')(app, express);


module.exports = app;