var Player = require('./player');
var utils = require('../../utils');

var Unknown = module.exports = utils.inherit(Player);

utils.extend(Unknown.prototype, {
  initialize: function () {
    this.changePersona(Player);
  },

  changePersona: function (klass) {
    this.player = new klass(this.user);
    this.emit('update');
  },
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
  utils.property(Unknown.prototype, prop);
};

var props = [
  'ability', 'look', 'isEvil', 'isJustice', 'isAssassin',
  'isMerlin', 'className', 'toJson', 'toString',
]

for (var i = 0; i < props.length; i++) {
  linkToPersona(props[i]);
}

