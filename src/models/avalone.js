var utils = require('../utils')
  , events = require('events')
  , User = require('./user')
  , Room = require('./room')
  , roomModule = require('../utils/room_module');

var Avalone = module.exports = function Avalone(connectorConstructor) {
  this.connector = connectorConstructor(this);
  this.rooms = [];
  this.users = {};

  this.on('enter', this.onEnter.bind(this))
}

utils.inherit(events.EventEmitter, Avalone);
utils.extend(Avalone.prototype, roomModule('users'));

Avalone.prototype.createRoom = function (owner) {
  var room = new Room(owner);
  this.rooms.push(room);
  room.on('destroy', this.removeRoom(room).bind(this, room));
}

Avalone.prototype.removeRoom = function (room) {
  var idx = this.rooms.indexOf(room);
  if (idx >= 0) { this.rooms.splice(idx, 1); }
}

Avalone.prototype.login = function (socket, id) {
  user = new User(id, id, socket);
  this.enter(user);
}

Avalone.prototype.onEnter = function (user) {
  this.connector.broadcast('login', user.toString());
}
