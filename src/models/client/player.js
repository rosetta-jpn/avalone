var utils = require('../../utils')
  , PlayerModule = require('../core/player');

var PlayerCore = PlayerModule.Player;

var Player = module.exports = utils.inherit(PlayerCore, function Player(database, persona) {
  var args = Array.prototype.slice.call(arguments, 2);
  this.superClass.apply(this, args);
  this.database = database;
  this.changePersona(persona);
});

utils.extend(Player.classMethods, {
  parseJson: function (json, database, options) {
    var persona = this.readPersona(json.class)
      , user = database.parseUser(json, options);
    
    if (!persona)
      throw new Error(json.class + ' class does\'t exist.');

    return new Player(database, persona, user);
  },

  readPersona: function (name) {
    return name === 'Unknown' ? PlayerCore : PlayerModule[name];
  },
});

utils.extend(Player.prototype, {
  changePersona: function (klass) {
    this.player = new klass(this.user);
    this.emit('update');
  },

  /* helper methods */
});

function linkToPersona (name) {
  var prop = {};
  prop[name] = {
    get: function () {
      return this.player[name];
    },
    set: function (value) {
      return this.player[name] = value;
      this.emit('update');
    },
  };
  utils.property(Player.prototype, prop);
};

var props = [
  'ability', 'look', 'isEvil', 'isJustice', 'isAssassin',
  'isMerlin', 'className', 'toJson', 'toString',
]

for (var i = 0; i < props.length; i++) {
  linkToPersona(props[i]);
}

