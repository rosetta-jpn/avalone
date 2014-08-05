var Team = require('../../models/team')
  , utils = require('../../utils');

Team.prototype.playerSelections = function () {
  var self = this;
  return this.game.players.map(function (player) {
    return {
      isTeamMember: {
        read: function () {
          return self.isContainMember(player);
        },
        publish: function (isContain) {
          if (isContain)
            self.add_group(self.selector, player);
          else
            self.remove_group(self.selector, player);
        }
      },

      player: player,
    }
  });
}

Team.prototype.votes = function () {
  var self = this;
  return this.game.players.map(function (player) {
    return {
      isApprove: function () {
        return self.isApprovedBy(player);
      },

      player: player,
    }
  });
}

Team.prototype.isMember = function () {
  return this.isContainMember(database.playerProfile);
}

