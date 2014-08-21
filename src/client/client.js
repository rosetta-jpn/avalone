var utils = require('../utils')
  , events = require('events');

var Client = module.exports = function Client(ioBoot) {
  this.ioBoot = ioBoot;
  this.eventQueue = {};
}

utils.inherit(events.EventEmitter, Client);
var originalOn = Client.prototype.on;

Client.prototype.on = function (type, callback) {
  // digest spared events
  if (this.eventQueue[type] && this.eventQueue[type].length) {
    setTimeout(this.digestEventQueue.bind(this), 0, type, this.eventQueue[type]);
    this.eventQueue[type] = [];
  }

  originalOn.call(this, type, callback);
}

Client.prototype.digestEventQueue = function (type, queue) {
  for (var i = 0; i < queue.length; i++) {
    this.emit(type, queue[i]);
  }
}

Client.prototype.submit = function emit(type, value) {
  utils.log("Submit:", type, value)
  this.socket.emit('submit', {
    type: type,
    value: value,
  });
}

Client.prototype.log = function (type, obj) {
  utils.log("Receive:", type, obj);
}

Client.prototype.start = function () {
  var self = this;
  if (this.socket) return;

  this.socket = this.ioBoot();
  this.socket.on('event', function (data) {
    utils.log('Received:', data);
    setTimeout(self.onEvent.bind(self), 0, data);
  });

  utils.log("Connect with socketIO")
}

Client.prototype.onEvent = function (event) {
  var type = event.type, content = event.content;

  // spare the event
  if (!this.listeners(type)) {
    this.eventQueue[type] = this.eventQueue[type] || [];
    this.eventQueue[type].push(content);
  }

  this.log(type, content);
  this.emit(type, content);
}

