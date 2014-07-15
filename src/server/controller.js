var utils = require('../utils')

var Controller = module.exports = function Controller(type, data, avalon, connector, socket) {
  this.type = type;
  this.data = data;
  this.avalon = avalon;
  this.connector = connector;
  this.socket = socket;
}

Controller.prototype.dispatch = function () {
  this[this.type + 'Callback']();
}

utils.property(Controller.prototype, {
  id: {
    get: function () { return this.socket.id; },
  },
  user: {
    get: function () { return this._user = this._user || this.avalon.users[this.id]; },
  },
})

utils.extend(Controller.prototype, {
  connectionCallback: function () {
    this.avalon.login(this.socket, this.id);
    this.user.notify('go:start');
  },

  disconnectCallback: function () {
    console.log('Disconnect:', this.user.toJson());
    this.user.disconnect();
  },

  enterCallback: function () {
    this.user.rename(this.data.user.name);
    var roomname = this.data.room.name;
    var room = this.avalon.rooms[roomname];
    if (room) {
      room.enter(this.user);
    } else {
      this.avalon.createRoom(this.user, this.data.room.name);
    }
    this.user.notify('go:lobby');
  },

  gameStartCallback: function () {
    this.user.room.newGame(this.user);
  },

});
