var utils = require('../utils')
  , RoomObserver = require('./room_observer')
  , UserObserver = require('./user_observer');

/* Public: AvalonObserver - observe Avalon and notify its events to clients.
 *
 * avalon - the Avalon object to observe.
 * connectorCreate - the constructor of SocketIOConnector.
 */
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
    new UserObserver(user);
    user.notify('connection', user.id);
    user.notify('go:start');
  },

  onUserLeave: function (user) {
  },

  onUserRename: function (user, name) {
    this.connector.notice('renameUser', name);
  },
});

