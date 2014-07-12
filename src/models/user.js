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

utils.property(User.prototype, 'className', {
  get: function(){ return this.classMethods.className; }
});

User.prototype.seePlayer = function (player) {
  return player.name + ": " + player.constructor.classMethods.className;
}

User.prototype.toString = function () {
  return user.name;
}

