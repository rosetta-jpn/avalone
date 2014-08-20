var Player = require('./player');
var utils = require('../../../utils');

var Evil = module.exports = utils.inherit(Player);

Evil.prototype.ability = utils.merge(Evil.prototype.ability, {
  findEvil: true,
  findMordred: true,
});

Evil.prototype.look = utils.merge(Evil.prototype.look, {
  evil: true,
});

Evil.prototype.isEvil = true;
Evil.classMethods.className = 'Evil';

