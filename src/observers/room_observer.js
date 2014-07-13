var utils = require('../utils');

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
  }, 

  onEnter: function (user) {
    this.room.notifyAll('enterRoom', {
      room: this.room.name,
      user: user.toJson(),
    });
  },

  onLeave: function (user) {
    this.room.notifyAll('leaveRoom', {
      room: this.room.name,
      user: user.toJson(),
    });
  }
})
