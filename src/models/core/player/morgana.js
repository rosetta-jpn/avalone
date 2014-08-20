var Evil = require('./evil');
var utils = require('../../../utils');

var Morgana = module.exports = utils.inherit(Evil);

Morgana.prototype.look = utils.merge(Morgana.prototype.look, {
  merlin: true,
});
Morgana.classMethods.className = 'Morgana';

