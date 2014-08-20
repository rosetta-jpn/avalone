var utils = require('../utils')
  , RoomObserver = require('./room_observer')
  , UserObserver = require('./user_observer');

/* Public: AvalonObserver - observe Avalon and notify its events to clients.
 *
 * avalon - the Avalon object to observe.
 * connectorCreate - the constructor of SocketIOConnector.
 */
var AvalonObserver = module.exports = function AvalonObserver(avalon, connector) {
  this.avalon = avalon;
  this.connector = connector;
  this.bind();
}

utils.extend(AvalonObserver.prototype, {
  bind: function () {
    this.avalon.on('createRoom', this.onNewRoom.bind(this));
    this.avalon.on('enter', this.onUserEnter.bind(this));
    this.avalon.on('leave', this.onUserLeave.bind(this));
  },

  onNewRoom: function (room) {
    new RoomObserver(room, this.avalon, this.connector);
    this.connector.notice('createRoom', room.name);
  },

  onUserEnter: function (user) {
    user.on('rename', this.onUserRename.bind(this, user));
    this.connector.notice('login', user.name);
    new UserObserver(user);
    user.notify('connection', user.id);
    user.notify('go:start');
    user.notify('avalon', { avalon: this.avalon.toJson(user), });
  },

  onUserLeave: function (user) {
  },

  onUserRename: function (user, name) {
    this.connector.notice('renameUser', name);
  },
});

