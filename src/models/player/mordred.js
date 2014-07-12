var Evil = require('./evil');
var utils = require('../../utils');

var Mordred = module.exports = utils.inherit(Evil);

Mordred.prototype.look = utils.merge(Mordred.prototype.look, {
  mordred: true,
});
Mordred.classMethods.className = 'Mordred';

