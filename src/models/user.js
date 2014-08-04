var events = require('events')
  // , UserLookPolicy = require('./user_look_policy')
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
});

utils.extend(User.prototype, {
  rename: function (name) {
    var oldname = this.name;
    this.name = name;
    if (!(oldname === name)) this.emit('rename', name);
  },

  disconnect: function () {
    this.emit('destroy');
  },

  seePlayer: function (player) {
    return player.name + ": " + player.constructor.classMethods.className;
  },

  toString: function () {
    return this.name;
  },

  toJson: function () {
    return {
      id: this.id,
      name: this.name,
    }
  },

  notify: function (type, value) {
    console.log("Notify", "(" + this.toString() + ")", type, value)
    this.socket.emit('event', {
      type: type,
      content: value,
    });
  }
});

