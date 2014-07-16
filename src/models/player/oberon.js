var Evil = require('./evil');
var utils = require('../../utils');

var Oberon = module.exports = utils.inherit(Evil);

Oberon.prototype.ability = utils.merge(Oberon.prototype.ability, {
  findEvil: false
});

Oberon.prototype.look = utils.merge(Oberon.prototype.look, {
  evil: false,
  oberon: true,
});
Oberon.classMethods.className = 'Oberon';

