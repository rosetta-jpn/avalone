var Game = require('../../models/game')
  , utils = require('../../utils');

utils.extend(Game.prototype, {
  playerSelections: function () {
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
  },

  // overwrite original create_Quest method for client.
  // TODO: Divide model's logic for client and server.
  create_Quest: function () {
  },

  addNewQuest: function (quest) {
    this.quests.push(quest);
    this.startCurrentQuest(quest);
  }
});

