require('../utils/extensions');

var express = require('express')
  , http = require('http')
  , path = require('path')
  , ECT = require('ect')
  , socketio = require('./socketio')
  , Avalon = require('../models/avalon');

var app = express();
var server = http.Server(app);
var ectRenderer = ECT({ watch: true, root: path.join(__dirname, '/../views'), ext: '.ect' })

app.set('port', 8888);
app.set('view engine', 'ect');
app.set('views', path.join(__dirname, '/../views'));

app.engine('ect', ectRenderer.render);

app.use(express.static(path.join(__dirname, '/../client')));
app.use(express.static(path.join(__dirname, '/../../public')));
app.use(express.static(path.join(__dirname, '/../../bower_components')));


app.get('/', function(req, res){
  res.render('index');
});

server.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'))
});

var connectorConstructor = socketio(server);
new Avalon(connectorConstructor);

