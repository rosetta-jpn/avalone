var utils = require('../utils')
  , Controller = require('./controller');

var SocketIOConnector = module.exports = function SocketIOConnector (ioserver, avalone) {
  this.ioserver = ioserver;
  this.avalone = avalone;
  this.startListen();
}

SocketIOConnector.prototype.startListen = function () {
  var self = this;
  this.ioserver.sockets.on('connection', function(socket) {
    console.log('Connection: ' + socket.id);

    self.newSocket(socket);
  });
}

SocketIOConnector.prototype.newSocket = function (socket) {
  var self = this;
  this.callController(socket, 'connection', {})

  socket.on('submit', function(data) {
    self.callController(socket, data.type, data.value)
  });

  socket.on('notice', function(data) {
    socket.broadcast.emit('receive', {
      type: data.type,
      user: data.user,
      value: data.value,
    });
  });

  socket.on('disconnect', function() {
    self.avalone.leave(socket, socket.id);
  });
}

SocketIOConnector.prototype.callController = function (socket, type, data) {
  new Controller(type, data, this.avalone, this, socket).dispatch();
}


SocketIOConnector.prototype.broadcast = function (type, data) {
  this.ioserver.emit(type, data);
}

SocketIOConnector.prototype.notice = function (type, value) {
  console.log('notice:', type + ',', value);
  this.ioserver.emit('notice', {
    type: type,
    value: value
  });
}
