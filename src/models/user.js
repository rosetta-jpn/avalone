var events = require('events')
  , utils = require('../utils');

var User = module.exports = function User(id, name, socket) {
  this.id = id;
  this.name = name;
  this.socket = socket;
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

  disconnect: function () {
    if (!this.room || !this.room.game) return this.destroy();
    this.socket = null;
    this.emit('disconnect');
  },

  destroy: function () {
    this.socket = null;
    this.emit('destroy');
  },

  relogin: function (user) {
    this.socket = user.socket;
    user.destroy();
    this.emit('relogin');
  },

  seePlayer: function (player) {
    return player.name + ": " + player.constructor.classMethods.className;
  },

  toString: function () {
    return this.name;
  },

  toJson: function () {
    var json = {
      id: this.id,
      name: this.name,
    };
    if (this.room) json.room = this.room.name
    return json;
  },

  notify: function (type, value) {
    utils.log("Notify", "(" + this.toString() + ")", type, value)
    if (this.isDisconnected()) return;
    this.socket.emit('event', {
      type: type,
      content: value,
    });
  },

  isDisconnected: function () {
    return !this.socket;
  },
});

