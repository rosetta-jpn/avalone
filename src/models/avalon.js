var utils = require('../utils')
  , events = require('events')
  , User = require('./user')
  , Room = require('./room')
  , roomModule = require('../utils/room_module');

// Public: Avalon - treat Users and Rooms
var Avalon = module.exports = function Avalon() {
  this.rooms = {};
  this.users = {};
}

utils.inherit(events.EventEmitter, Avalon);
utils.extend(Avalon.prototype, roomModule('users', 'socketId'));

Avalon.classMethods.timeoutMSec = 1000 * 3 * 60;

utils.extend(Avalon.prototype, {
  createRoom: function (owner, name) {
    if (this.rooms[name]) throw new Error('Room: ' + name + ' is already exists.');
    var room = new Room(owner, name);
    this.rooms[room.name] = room;
    this.emit('createRoom', room);
    room.on('destroy', this.removeRoom.bind(this, room));
    return room;
  },

  removeRoom: function (room) {
    delete this.rooms[room.name]
  },

  login: function (socket, id) {
    user = new User(id, id, socket);
    this.enter(user);
    user.on('disconnect', this.onDisconnectUser.bind(this, user, user.socketId))
    return user;
  },

  onDisconnectUser: function (user, socketId) {
    var timeoutId =
      utils.setTimeout(function() { user.destroy(); }, this.classMethods.timeoutMSec);
    user.once('relogin', function () { clearTimeout(timeoutId) });
    user.once('relogin', this.onRelogin.bind(this, user));
    this.leaveByIndetifier(socketId, true);
  },

  onRelogin: function (user) {
    this.enter(user, true);
  },
});

