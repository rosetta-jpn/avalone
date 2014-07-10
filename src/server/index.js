var express = require('express')
  , http = require('http')
  , path = require('path')
  , socketio = require('./socketio');

var app = express();
var server = http.Server(app);

app.set('views', __dirname + '/../views');
app.set('port', 8888);
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, '/../client')));
app.use(express.static(path.join(__dirname, '/../../public')));
app.use(express.static(path.join(__dirname, '/../../bower_components')));

app.get('/', function(req, res){
  res.render('index');
});

server.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'))
});

socketio(server);
