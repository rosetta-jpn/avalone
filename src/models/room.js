var utils = require('../utils')
  , events = require('events')
  , Game = require('./game')
  , roomModule = require('../utils/room_module');

var Room = module.exports = function Room(owner, name) {
  this.owner = owner;
  this.name = name;
  this.userList = {};
  this.on('enter', this.onEnter.bind(this));
  this.on('leave', this.onLeave.bind(this));
  this.enter(owner);
}

utils.inherit(events.EventEmitter, Room);
utils.extend(Room.prototype, roomModule('userList'));

utils.property(Room.prototype, {
  users: {
    get: function () {
      if (this._users) return this._users;
      return this._users = Object.values(this.userList);
    }
  },
});

Room.prototype.newGame = function (controller) {
  if (this.game)
    throw new Error('game is already started');
  if (controller != this.owner)
    throw new Error('Only owner ' + controller.id + ' can start a game ' + this.owner.id);

  users = this.calcUsers();
  if (users.length < 5)
    throw new Error('To start game, the room must have more than 5 users (current users: '
                    + users.length + ')');

  var game = this.game = Game.classMethods.assignAndCreate(users);
  game.on('end', this.removeGame.bind(this));
  this.emit('newGame', game);
  game.start();
  return game;
}

Room.prototype.removeGame = function () {
  delete this.game;
}

Room.prototype.toString = function () {
  return this.name;
}

Room.prototype.onEnter = function (user) {
  user.room = this;
  user.once('destroy', this.leave.bind(this, user));
  this._users = null;
  this.emit('update');
}

Room.prototype.onLeave = function (user) {
  delete user.room;
  this.emit('update');
}

Room.prototype.calcUsers = function () {
  return Object.values(this.userList);
}

Room.prototype.notifyAll = function (type, data) {
  users = this.calcUsers();
  users.forEach(function (user) {
    user.notify(type, data);
  });
}

Room.prototype.toJson = function (user) {
  var toJson = function (obj) { return obj.toJson(user); }
  return {
    name: this.name,
    owner: toJson(this.owner),
    users: users.map(toJson),
    game: this.game ? this.game.toJson() : null,
  }
}
