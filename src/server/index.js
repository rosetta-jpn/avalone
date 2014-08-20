require('../utils/extensions');

var express = require('express')
  , http = require('http')
  , path = require('path')
  , ECT = require('ect')
  , socketio = require('./socketio')
  , Config = require('./config')
  , Avalon = require('../models/server/avalon')
  , AvalonObserver = require('../observers/avalon_observer');

var app = express();
var server = http.Server(app);
var ectRenderer = ECT({ watch: true, root: path.join(__dirname, '/../views'), ext: '.ect' })
var config = new Config({ env: process.env['NODE_ENV'], port: process.env['NODE_PORT'] });

app.set('port', config.port);
app.set('view engine', 'ect');
app.set('views', path.join(__dirname, '/../views'));

app.engine('ect', ectRenderer.render);

app.use(express.static(path.join(__dirname, '/../../dist/js')));
app.use(express.static(path.join(__dirname, '/../client')));
app.use(express.static(path.join(__dirname, '/../../public')));
app.use(express.static(path.join(__dirname, '/../../bower_components')));

app.get('/', function(req, res){
  res.render('index', { config: config });
});

if (!config.isProduction()) {
  app.use('/mocha', express.static(path.join(__dirname, '/../../node_modules/mocha')));
  app.get('/test', function(req, res){
    res.render('test');
  });
}

server.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'))
});

var avalon = new Avalon();
var connector = socketio(server, config, avalon);

new AvalonObserver(avalon, connector);
connector.startListen();
