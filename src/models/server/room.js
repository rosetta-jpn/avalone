var utils = require('../../utils')
  , Game = require('./game')
  , RoomCore = require('../core/room');

var Room = module.exports = utils.inherit(RoomCore, function Room() {
  var args = Array.prototype.slice.call(arguments, 0);
  this.superClass.apply(this, args);
});

utils.extend(Room.classMethods, {
});

utils.extend(Room.prototype, {
  enterOrRelogin: function (newUser) {
    var user;
    if (user = this.userList[newUser.name]) {
      if (!user.isDisconnected())
        throw 'User having the same name already exists.';
      user.relogin(newUser);
    } else {
      this.enter(newUser);
    }
  },

  newGame: function (controller) {
    if (this.game)
      throw new Error('game is already started');
    if (controller != this.owner)
      throw new Error('Only owner ' + controller.id + ' can start a game ' + this.owner.id);

    if (this.users.length < 5)
      throw new Error('To start game, the room must have more than 5 users (current users: '
                      + this.users.length + ')');

    var game = this.game = new Game(this.users);
    game.on('end', this._removeGame.bind(this));
    this.emit('newGame', game);
    game.start();
    return game;
  },

  _removeGame: function () {
    delete this.game;
  },

  notifyAll: function (type, data) {
    this.users.forEach(function (user) {
      user.notify(type, data);
    });
  },
});

