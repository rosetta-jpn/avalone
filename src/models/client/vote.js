var utils = require('../../utils')
  , VoteCore = require('../core/vote');

var Vote = module.exports = utils.inherit(VoteCore, function Vote(database, voteMap) {
  var args = Array.prototype.slice.call(arguments, 2);
  this.superClass.apply(this, args);
  this.database = database;
  this.voteMap = voteMap;
});

utils.extend(Vote.classMethods, {
  parseJson: function (json, database, options) {
    var members = json.members.map(function (player) {
      return database.parsePlayer(player, options);
    });

    return new Vote(database, json.voteMap, json.id, members, json.requiredApproval);
  },

  mergeJson: function (original, json, database, options) {
    var newVote = this.parseJson(json, database, options);
    original.voteMap = newVote.voteMap;
    return original;
  },
});

utils.extend(Vote.prototype, {
  /* helper methods */

  amIVoted: function () {
    return this.database.playerProfile && this.isVoted(this.database.playerProfile);
  },

  amIApproved: function () {
    return this.database.playerProfile && this.isApprovedBy(this.database.playerProfile);
  },

  eachPlayerVote: function () {
    var self = this;
    return this.members.map(function (player) {
      return {
        isApprove: function () {
          return self.isApprovedBy(player);
        },

        player: player,
      };
    });
  },
});
