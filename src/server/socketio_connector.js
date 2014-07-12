var utils = require('../utils');

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
  this.avalone.login(socket, socket.id);

  socket.on('notice', function(data) {
    socket.broadcast.emit('receive', {
      type : data.type,
      user : data.user,
      value : data.value,
    });
  });

  socket.on('disconnect', function() {
    self.avalone.leave(socket, socket.id);
  });
}

SocketIOConnector.prototype.broadcast = function (type, data) {
  this.ioserver.emit(type, data);
}
