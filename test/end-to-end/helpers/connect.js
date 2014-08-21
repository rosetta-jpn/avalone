SocketMock = require('./socket_mock');

module.exports = function connect(client, server, socketOptions) {
  var socket = new SocketMock(server, socketOptions);

  client.connectDummyServer(server);
  server.bindSocketAndClient(client, socket);
  server.connectionEvent(socket);

  return socket;
}

