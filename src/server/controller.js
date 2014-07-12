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

Controller.prototype.enterCallback = function () {
  this.user.rename(this.data.user.name);
  this.avalon.createRoom(this.user, this.data.room.name)
}

Controller.prototype.connectionCallback = function () {
  this.avalon.login(this.socket, this.id);
}
