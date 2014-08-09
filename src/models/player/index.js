var PlayerModule = module.exports = {};
var User = require('../user');

PlayerModule.Player = require('./player');
PlayerModule.Evil = require('./evil');
PlayerModule.Justice = require('./justice');
PlayerModule.Merlin = require('./merlin');
PlayerModule.Mordred = require('./mordred');
PlayerModule.Morgana = require('./morgana');
PlayerModule.Oberon = require('./oberon');
PlayerModule.Percival = require('./percival');
PlayerModule.Assassin = require('./assassin');
PlayerModule.Unknown = require('./unknown');

PlayerModule.readClass = function (className) {
  var klass = this[className]
  if (!klass) klass = this.Unknown;
  return klass
}
