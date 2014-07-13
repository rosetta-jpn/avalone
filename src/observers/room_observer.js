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
    var self = this;
    members = this.room.calcUsers();
    members.forEach(function (member) {
      member.notify('enterRoom', {
        room: self.room.name,
        user: user.toJson(),
      });
    });
  },

  onLeave: function (user) {
    var self = this;
    members = this.room.calcUsers();
    members.forEach(function (member) {
      member.notify('leaveRoom', {
        room: self.room.name,
        user: user.toJson(),
      });
    });
  }
})
