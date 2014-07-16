var utils = require('../utils')
  , GameObserver = require('./game_observer');

var RoomObserver = module.exports = function RoomObserver(room, avalon) {
  this.room = room;
  this.avalon = avalon;
  this.bind();
  this.onEnter(room.owner);
}

utils.extend(RoomObserver.prototype, {
  bind: function () {
    this.room.on('enter', this.onEnter.bind(this))
    this.room.on('leave', this.onLeave.bind(this))
    this.room.on('newGame', this.onNewGame.bind(this))
  }, 

  onEnter: function (user) {
    var users = this.room.calcUsers().map(function (user) { return user.toJson(); })
    this.room.notifyAll('enterRoom', {
      room: this.room.name,
      user: user.toJson(),
    });
    user.notify('go:lobby');
    user.notify('room', {
      room: this.room.name,
      users: users,
    });
  },

  onLeave: function (user) {
    this.room.notifyAll('leaveRoom', {
      room: this.room.name,
      user: user.toJson(),
    });
  },

  onNewGame: function (game) {
    new GameObserver(game, this.room);
  },
})
