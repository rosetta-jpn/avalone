var Justice = require('./justice')
  , utils = require('../../utils');

var Merlin = module.exports = utils.inherit(Justice);

Merlin.prototype.ability = utils.merge(Merlin.prototype.ability, {
  findEvil: true,
  findOberonAsEvil: true,
});

Merlin.prototype.look = utils.merge(Merlin.prototype.look, {
  merlin: true,
});

utils.extend(Merlin.prototype, {
  isMerlin: true,
});

Merlin.classMethods.className = 'Merlin';
