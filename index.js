var app = require('./server/server.js');

var port = process.env.PORT || 4000;
console.log('app is listening on port ',  port);
app.listen(port);