var socketio = require('socket.io')
  , Connector = require('./socketio_connector');

function sio(server, config, avalon) {
  var ioserver = socketio(server);
  return new Connector(ioserver, avalon, config);
}

module.exports = sio;
