var events = require('events')
  , utils = require('../../utils');

var User = module.exports = function User(id, name, socket) {
  this.id = id;
  this.name = name;
  this.socket = socket;

  if (this.name.length >= 50)
    throw new Error('username is too long');
}

utils.inherit(events.EventEmitter, User);
User.classMethods.className = 'User';

utils.property(User.prototype, { 
  className: {
    get: function(){ return this.classMethods.className; }
  },

  socketId: {
    get: function(){ return this.socket ? this.socket.id : null; }
  }
});

utils.extend(User.prototype, {
  rename: function (name) {
    var oldname = this.name;
    this.name = name;
    if (!(oldname === name)) this.emit('rename', name);
  },

  destroy: function () {
    this.emit('destroy');
  },

  seePlayer: function (player) {
    return player.name + ": " + player.constructor.classMethods.className;
  },

  isSame: function (user) {
    return this.id === user.id;
  },

  toString: function () {
    return this.name;
  },

  toJson: function () {
    return {
      id: this.id,
      name: this.name,
      isDisconnected: this.isDisconnected(),
      room: this.room ? this.room.name : undefined,
    };
  },
});

