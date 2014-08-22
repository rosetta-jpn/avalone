var Justice = require('./justice');
var utils = require('../../../utils');

var Percival = module.exports = utils.inherit(Justice);

Percival.prototype.ability = utils.merge(Percival.prototype.ability, {
  findMerlin: true,
});
Percival.classMethods.className = 'Percival';

