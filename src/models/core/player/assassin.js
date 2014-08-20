var Evil = require('./evil');
var utils = require('../../../utils');

var Assassin = module.exports = utils.inherit(Evil);
utils.extend(Assassin.prototype, {
  isAssassin: true,
});

Assassin.classMethods.className = 'Assassin';
