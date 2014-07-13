var utils = require('../utils')
  , events = require('events')
  , roomModule = require('../utils/room_module');

var Room = module.exports = function Room(owner, name) {
  this.owner = owner;
  this.name = name;
  this.userList = {};
  this.enter(owner);
}

utils.inherit(events.EventEmitter, Room);
utils.extend(Room.prototype, roomModule('userList'));

Room.prototype.gameStart = function (controller) {
  if (this.game || !controller) { return; }
  users = this.calcUsers();
  if (users.length >= 5) {
    var game = this.game = new Game(users);
    game.on('end', this.removeGame.bind(this));
  }
}

Room.prototype.removeGame = function () {
  delete this.game;
}

Room.prototype.toString = function () {
  return this.name;
}

Room.prototype.calcUsers = function () {
  return Object.values(this.userList);
}
