var Player = require('./player');
var utils = require('../../../utils');

var Justice = module.exports = utils.inherit(Player);
Justice.prototype.isJustice = true;

Justice.classMethods.className = 'Justice';

