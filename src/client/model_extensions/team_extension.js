var Team = require('../../models/team')
  , utils = require('../../utils');

utils.extend(Team.classMethods, {
  registerDatabase: function (database) {
    this.database = database;
  },
})

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
          self.emit('change:Team.playerSelections');
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
  return this.isContainMember(this.classMethods.database.playerProfile);
}

Team.prototype.isTeamSelector = function () {
  return this.selector.id === this.classMethods.database.playerProfile.id;
}

Team.prototype.votedApprove = function () {
  
}


