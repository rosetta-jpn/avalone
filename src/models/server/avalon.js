var utils = require('../../utils')
  , User = require('./user')
  , Room = require('./room')
  , AvalonCore = require('../core/avalon');

var Avalon = module.exports = utils.inherit(AvalonCore, function Avalon() {
  this.superClass.apply(this, arguments);
});

utils.extend(Avalon.classMethods, {
  timeoutMSec: 1000 * 3 * 60,
});

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
    user = new User(socket, id, id);
    this.enter(user);
    user.on('disconnect', this.onDisconnectUser.bind(this, user, user.socketId))
    return user;
  },

  onDisconnectUser: function (user, socketId) {
    var timeoutId =
      utils.setTimeout(function() { user.destroy(); }, this.classMethods.timeoutMSec);
    user.once('relogin', function () { clearTimeout(timeoutId) });
    user.once('relogin', this.onRelogin.bind(this, user));
    this.leaveByIdetifier(socketId, true);
  },

  onRelogin: function (user) {
    this.enter(user, true);
  },
});

