var socketio = require('socket.io')
  , Connector = require('./socketio_connector');

function sio(server) {
  var ioserver = socketio(server);
  return function (avalone) {
    return new Connector(ioserver, avalone);
  };
}

module.exports = sio;
