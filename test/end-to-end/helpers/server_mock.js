var utils = require('../../../src/utils')
  , events = require('events');

var Requirements = require('./requirements');
var AvalonObserver = Requirements.Server.Observers.AvalonObserver;

var ServerConnection = module.exports = function ServerConnection(avalon, controller, config) {
  this.avalon = avalon;
  this.controller = controller;
  this.config = config;
  this.setup()
}

utils.inherit(events.EventEmitter, ServerConnection);
utils.extend(ServerConnection.prototype, {
  setup: function () {
    this.observer = new AvalonObserver(this.avalon, this);
  },

  dispatchSubmittion: function (socket, type, content) {
    utils.log('Server dispatching:', type, content);
    new this.controller(type, this.avalon, this, socket, this.config).dispatch(content)
  },

  receive: function (socket, data) {
    this.dispatchSubmittion(socket, data.type, data.value);
  },

  notifyAll: function (type, value) {
    utils.log('Send To Client:', type + ',', value);
    this.emit('event', {
      type: type,
      content: value,
    });
  },

  notice: function () {
    this.notifyAll.apply(this, arguments);
  },

  sendToClient: function (client, socket, data) {
    utils.log('Send To Client (' + socket.id + '):', data.type + ',', data.value);
    client.sendEvent(data.type, data.content);
  },

  bindSocketAndClient: function (client, socket) {
    client.on('submit', this.receive.bind(this, socket));
    socket.on('event', this.sendToClient.bind(this, client, socket));
  },

  connectionEvent: function (socket) {
    this.dispatchSubmittion(socket, 'connection', {});
  },
});
