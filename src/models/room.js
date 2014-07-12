var utils = require('../utils')
  , events = require('events')
  , roomModule = require('../utils/room_module');

var Room = module.exports = function Room() {
  this.userList = {};
}

utils.inherit(events.EventEmitter, Room);
utils.extend(Room.prototype, roomModule('userList'));

Room.prototype.gameStart = function (controller) {
  if (this.game || !controller) { return; }
  users = Object.values(this.userList);
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

