var utils = require('../utils')
  , events = require('events')
  , User = require('./user')
  , Room = require('./room')
  , roomModule = require('../utils/room_module');

var Avalon = module.exports = function Avalon(connectorConstructor) {
  this.connector = connectorConstructor(this);
  this.rooms = {};
  this.users = {};
  this.on('enter', this.onEnter.bind(this))
}

utils.inherit(events.EventEmitter, Avalon);
utils.extend(Avalon.prototype, roomModule('users'));
utils.extend(Avalon.prototype, {
  createRoom: function (owner, name) {
    if (this.rooms[name]) throw new Error('Room: ' + name + ' is already exists.');
    var room = new Room(owner, name);
    this.rooms[room.name] = room;
    this.trigger('createRoom', room);
    room.on('destroy', this.removeRoom.bind(this, room));
  },

  removeRoom: function (room) {
    delete this.rooms[room.name]
  },

  login: function (socket, id) {
    user = new User(id, id, socket);
    this.enter(user);
    user.on('rename', this.onUserRename.bind(this, user));
  },

  onEnter: function (user) {
    this.connector.notice('login', user.toString());
  },

  onUserRename: function (user, name) {
    this.connector.notice('renameUser', name);
  },

  createRoomCallback: function (room) {
    this.connector.notice('createRoom', room.toString());
  },

  trigger: function (type, data) {
    this.emit(type, data);
    var callback = this[type + "Callback" ];
    if (callback) {
      callback.call(this, data);
    }
  },
});

