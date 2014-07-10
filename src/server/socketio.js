var socketio = require('socket.io');

function sio(server) {
  var ioserver = socketio(server);

  ioserver.sockets.on('connection', function(socket) {
    console.log('a user connected');

    socket.on('notice', function(data) {
      socket.broadcast.emit('receive', {
        type : data.type,
        user : data.user,
        value : data.value,
      });
    });

    socket.on('disconnect', function() {
    });
  });
}

module.exports = sio;
