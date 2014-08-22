var utils = require('../../../src/utils')
  , events = require('events');

var SocketMock = module.exports = function SocketMock(connection, options) {
  this.connection = connection;
  this.id = options.id;
}

utils.inherit(events.EventEmitter, SocketMock);
