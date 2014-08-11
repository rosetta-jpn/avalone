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
    this.user.notify('relogin', this.user.toJson());
    this.user.notify('go:start')
    if (this.user) {
      this.user.notify('resume:Room', this.user.room.toJson());
      var game;
      if (game = this.user.room.game) {
        var player = game.findPlayer(this.user.id);
        this.user.notify('resume:Game', {
          game: game.toJson(player),
          roomName: this.user.room.name,
        });
      }
    }
  },
});

