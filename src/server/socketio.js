var socketio = require('socket.io')
  , Connector = require('./socketio_connector');

function sio(server, config) {
  var ioserver = socketio(server);
  return function (avalon) {
    return new Connector(ioserver, avalon, config);
  };
}

module.exports = sio;
