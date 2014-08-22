var utils = require('../../utils')
  , UserCore = require('../core/user');

var User = module.exports = utils.inherit(UserCore, function User(socket) {
  var args = Array.prototype.slice.call(arguments, 1);
  this.superClass.apply(this, args);
  this.socket = socket;
});

utils.extend(User.classMethods, {
});

utils.extend(User.prototype, {
  disconnect: function () {
    if (!this.room || !this.room.game) return this.destroy();
    this.socket = null;
    this.emit('disconnect');
  },

  destroy: function () {
    this.socket = null;
    this.emit('destroy');
  },

  relogin: function (user) {
    this.socket = user.socket;
    user.destroy();
    this.emit('relogin');
  },

  notify: function (type, value) {
    utils.log("Notify", "(" + this.toString() + ")", type, value)
    if (this.isDisconnected()) return;
    this.socket.emit('event', {
      type: type,
      content: value,
    });
  },

  isDisconnected: function () {
    return !this.socket;
  },
});
