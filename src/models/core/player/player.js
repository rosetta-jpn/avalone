var events = require('events')
  , PlayerLookPolicy = require('./player_look_policy')
  , User = require('../user')
  , utils = require('../../../utils');

var Player = module.exports = function Player(user) {
  this.user = user;
}

utils.inherit(events.EventEmitter, Player);

utils.extend(Player.classMethods, {
  className: 'Player',
});

utils.property(Player.prototype, {
  id: { get: function () { return this.user.id; } },
  name: { get: function () { return this.user.name; } },
  socket: { get: function () { return this.user.socket; } },
  notify: { get: function () { return this.user.notify.bind(this.user); } },
  className: { get: function () { return this.classMethods.className; } },
});

utils.extend(Player.prototype, {
  ability: {
    findMerlin: false,
    findEvil: false,
    findMordred: false,
    findOberonAsEvil: false,
  },

  look: {
    merlin: false,
    evil: false,
    mordred: false,
    oberon: false,
  },

  rename: function (name) {
    this.emit('notice', {
      type : 'rename',
    });
  },

  seePlayer: function (player) {
    return Player.name + ": " + this._seePlayerClass(player);
  },

  _seePlayerClass: function (player, options) {
    return new PlayerLookPolicy(this, player, options).look;
  },

  isSame: User.prototype.isSame,

  toString: function (looker) {
    var json = this.toJson(looker);
    return json.name + ': ' + json.class;
  },

  toJson: function (looker, options) {
    var pclass = looker ? looker._seePlayerClass(this, options) : this.classMethods.className;
    return {
      id: this.id,
      name: this.name,
      class: pclass,
    };
  },

  isEvil: false,
  isJustice: false,
  isAssassin: false,
  isMerlin: false,
});

