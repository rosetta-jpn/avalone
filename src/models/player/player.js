var events = require('events')
  , PlayerLookPolicy = require('./player_look_policy')
  , User = require('../user')
  , utils = require('../../utils');

var Player = module.exports = function Player(user) {
  this.user = user;
  if (this.initialize) this.initialize(user);
}

utils.inherit(events.EventEmitter, Player);
Player.classMethods.className = 'Player';

utils.property(Player.prototype, {
  id: { get: function () { return this.user.id; } },
  name: { get: function () { return this.user.name; } },
  socket: { get: function () { return this.user.socket; } },
});

Player.prototype.notify = User.prototype.notify;

Player.prototype.ability = {
  findMerlin: false,
  findEvil: false,
  findMordred: false,
  findOberonAsEvil: false,
}

Player.prototype.look = {
  merlin: false,
  evil: false,
  mordred: false,
  oberon: false,
}

Player.prototype.rename = function (name) {
  this.emit('notice', {
    type : 'rename',
  });
}

Player.prototype.seePlayer = function (player) {
  return Player.name + ": " + this._seePlayerClass(player);
}

Player.prototype._seePlayerClass = function (player, options) {
  return new PlayerLookPolicy(this, player, options).look;
}

Player.prototype.toString = function (looker) {
  var json = this.toJson(looker);
  return json.name + ': ' + json.class;
}

Player.prototype.toJson = function (looker, options) {
  var pclass = looker ? looker._seePlayerClass(this, options) : this.classMethods.className;
  return {
    id: this.id,
    name: this.name,
    class: pclass,
  };
}

utils.property(Player.prototype, {
  className: {
    get: function () {
      return this.classMethods.className;
    }
  },
});

Player.prototype.isEvil = false;
Player.prototype.isJustice = false;
Player.prototype.isAssassin = false;
Player.prototype.isMerlin = false;

