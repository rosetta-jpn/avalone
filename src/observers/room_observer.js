var utils = require('../utils')
  , GameObserver = require('./game_observer');

var RoomObserver = module.exports = function RoomObserver(room, avalon, connector) {
  this.room = room;
  this.avalon = avalon;
  this.connector = connector;
  this.bind();
  this.onNewRoom(room);
  this.onEnter(room.owner);
}

utils.extend(RoomObserver.prototype, {
  bind: function () {
    this.room.on('enter', this.onEnter.bind(this));
    this.room.on('leave', this.onLeave.bind(this));
    this.room.on('newGame', this.onNewGame.bind(this));
    this.room.on('destroy', this.onDestroy.bind(this));
  },

  onNewRoom: function (room) {
    this.connector.notifyAll('new:Room', {
      room: this.room.toJson(),
    });
  },

  onEnter: function (user) {
    var users = this.room.users.map(function (user) { return user.toJson(); })
    this.connector.notifyAll('enter:User', {
      roomName: this.room.name,
      user: user.toJson(),
    });
    user.notify('go:lobby');
  },

  onLeave: function (user) {
    this.connector.notifyAll('leave:User', {
      roomName: this.room.name,
      user: user.toJson(),
    });
  },

  onNewGame: function (game) {
    new GameObserver(game, this.room);
  },

  onDestroy: function () {
    this.connector.notifyAll('destroy:Room', {
      room: this.room.toJson(),
    });
  },
})
