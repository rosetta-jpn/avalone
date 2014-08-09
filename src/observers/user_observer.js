var utils = require('../utils');

/* Public: UserObserver - observe Avalon and notify its events to clients.
 *
 * user - the Avalon object to observe.
 */
var UserObserver = module.exports = function UserObserver(user) {
  this.user = user;
  this.bind();
}

utils.extend(UserObserver.prototype, {
  bind: function () {
    this.user.on('relogin', this.onRelogin.bind(this));
  },

  onRelogin: function () {
    this.user.notify('relogin');
  },
});

