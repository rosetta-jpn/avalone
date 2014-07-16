var utils = require('../utils')
  , RoomObserver = require('./room_observer');

var AvalonObserver = module.exports = function AvalonObserver(avalon, connectorCreate) {
  this.avalon = avalon;
  this.bind();
  this.onInit(connectorCreate);
}

utils.extend(AvalonObserver.prototype, {
  bind: function () {
    this.avalon.on('createRoom', this.onNewRoom.bind(this));
    this.avalon.on('enter', this.onUserEnter.bind(this));
    this.avalon.on('leave', this.onUserLeave.bind(this));
  },

  onInit: function (connectorCreate) {
    this.connector = connectorCreate(this.avalon);
  },

  onNewRoom: function (room) {
    new RoomObserver(room, this.avalon);
    this.connector.notice('createRoom', room.toString());
  },

  onUserEnter: function (user) {
    user.on('rename', this.onUserRename.bind(this, user));
    this.connector.notice('login', user.toString());
    user.notify('go:start');
  },

  onUserLeave: function (user) {
  },

  onUserRename: function (user, name) {
    this.connector.notice('renameUser', name);
  },
});

