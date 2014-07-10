var express = require('express');
var http = require('http');
var path = require('path');

var app = express();

app.set('views', __dirname + '/../views');
app.set('port', 8888);
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, '/../../public')));

app.get('/', function(req, res){
  res.render('index');
});

app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'))
});
