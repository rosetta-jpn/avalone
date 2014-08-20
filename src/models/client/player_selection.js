var utils = require('../../utils');

module.exports = PlayerSelection;
function PlayerSelection (candidatePlayers, selectionSize, read, publish) {
  this.players = candidatePlayers;
  this.selectionSize = selectionSize;
  this.read = read;
  this.publish = publish;
  this.buildCandidates();
}

utils.extend(PlayerSelection.prototype, {
  buildCandidates: function () {
    var self = this;
    this.candidates =  this.players.map(function (player) {
      return {
        isSelected: {
          read: function () { return self.read(player); },
          publish: function (value) { return self.publish(player, value); },
        },

        player: player,
      };
    });
  },
});
