var Game = require('../../models/game')
  , utils = require('../../utils');

Game.prototype.playerSelections = function () {
  var self = this;
  return this.players.map(function (player) {
    return {
      isSelected: {
        read: function () {
          return self.target === player;
        },
        publish: function (isContain) {
          if (isContain) {
            self.target = player;
          } else if (self.target === player) {
            self.target = null;
          }
        }
      },

      player: player,
    }
  });
}

