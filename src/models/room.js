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

Room.prototype.gameStart = function (controller) {
  if (this.game || !controller) { return; }
  users = this.calcUsers();
  if (users.length >= 5) {
    var game = this.game = new Game(users);
    this.emit('newGame', game);
    game.on('end', this.removeGame.bind(this));
  }
}

Room.prototype.removeGame = function () {
  delete this.game;
}

Room.prototype.toString = function () {
  return this.name;
}

Room.prototype.onEnter = function (user) {
  user.room = this;
  user.on('destroy', this.leave.bind(this, user));
}

Room.prototype.onLeave = function (user) {
  delete user.room;
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
