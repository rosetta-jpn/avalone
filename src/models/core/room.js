var utils = require('../../utils')
  , events = require('events')
  , Game = require('./game')
  , roomModule = require('../../utils/room_module');

var Room = module.exports = function Room(owner, name) {
  this.owner = owner;
  this.name = name;
  this.userList = {};
  this.on('enter', this.onEnter.bind(this));
  this.on('leave', this.onLeave.bind(this));
  this.enter(owner);
}

utils.inherit(events.EventEmitter, Room);
utils.extend(Room.prototype, roomModule('userList', 'id'));

utils.property(Room.prototype, {
  users: {
    get: function () {
      if (this._users) return this._users;
      return this._users = Object.values(this.userList);
    }
  },
});

utils.extend(Room.prototype, {
  destroy: function () {
    var users = this.users;
    for (var i = 0; i < users.length; i++) {
      this.leave(users[i]);
    }
    this.emit('destroy', this);
  },

  onEnter: function (user) {
    user.room = this;
    user.once('destroy', this.leave.bind(this, user));
    this._users = null;
    this.emit('update');
  },

  onLeave: function (user) {
    if (user.room) delete user.room;
    this._users = null;
    if (this.owner === user) this.destroy();
    else this.emit('update');
  },

  toJson: function (user) {
    function toJson(obj) { return obj.toJson(user); }
    return {
      name: this.name,
      owner: toJson(this.owner),
      users: this.users.map(toJson),
      game: this.game ? this.game.id : null,
    }
  }
});
