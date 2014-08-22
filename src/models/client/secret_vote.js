var utils = require('../../utils')
  , VoteCore = require('../core/vote');

var SecretVote = module.exports =
  utils.inherit(VoteCore,
                function SecretVote(database, id,
                                    members, requiredApproval,
                                    areYouVoted, areYouApproved,
                                    approvalCount, rejectionsCount) {
  this.superClass.call(this, id, members, requiredApproval);
  this.database = database;
  this._approvalCount = approvalCount;
  this._rejectionsCount = rejectionsCount;
  this.areYouVoted = areYouVoted;
  this.areYouApproved = areYouApproved;
});

utils.extend(SecretVote.classMethods, {
  parseJson: function (json, database, options) {
    var members = json.members.map(function (player) {
      return database.parsePlayer(player, options);
    });

    return new SecretVote(database, json.id,
                          members, json.requiredApproval,
                          json.areYouVoted, json.areYouApproved,
                          json.approvalCount, json.rejectionsCount);
  },

  mergeJson: function (original, json, database, options) {
    var newVote = this.parseJson(json, database, options);
    original._approvalCount = newVote.approvalCount();
    original._rejectionsCount = newVote.rejectionsCount();
    original.areYouVoted = newVote.amIVoted();
    original.areYouApproved = newVote.amIApproved();
    return original;
  },
});

utils.extend(SecretVote.prototype, {
  vote: function (player, value) {
    if (!this._isMe(player)) return;
    this.areYouVoted = true;
    this.areYouApproved = value;
  },

  approvalCount: function () { return this._approvalCount; },
  rejectionsCount: function () { return this._rejectionsCount; },
  amIVoted: function () { return this.areYouVoted; },
  amIApproved: function () { return this.areYouApproved; },
  isAllVoted: function () {
    return this.approvalCount() + this.rejectionsCount() === this.members.length;
  },

  _isMe: function (player) {
    return this.database.playerProfile && this.database.playerProfile.isSame(player);
  },
});
