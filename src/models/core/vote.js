var utils = require('../../utils')
  , events = require('events');

module.exports = Vote;
function Vote (id, members, requiredApproval) {
  this.id = id;
  this.voteMap = {};
  this.members = members;
  this.requiredApproval = requiredApproval;
}

utils.inherit(events.EventEmitter, Vote);
utils.extend(Vote.prototype, {
  vote: function (voter, value) {
    if (!this.isMember(voter))
      throw new Error('Only members can vote.');
    this.voteMap[voter.id] = value;
    this.emit('vote', voter, value)
  },

  isAllVoted: function () {
    return Object.keys(this.voteMap).length === this.members.length;
  },

  isMember: function (player) {
    return this.members.some(function (member) {
      return member.isSame(player);
    });
  },

  approvalCount: function () {
    var approval = 0;
    for (var id in this.voteMap) if (this.voteMap[id]) approval++;
    return approval;
  },

  rejectionsCount: function () {
    var rejections = 0;
    for (var id in this.voteMap) if (!this.voteMap[id]) rejections++;
    return rejections;
  },

  isApproved: function () {
    return this.approvalCount() >= this.requiredApproval;
  },

  isRejected: function () {
    return this.approvalCount() < this.requiredApproval;
  },

  isApprovedBy: function (player) {
    return this.voteMap[player.id];
  },

  isVoted: function (player) {
    return this.voteMap.hasOwnProperty(player.id);
  },

  judge: function () {
    if (!this.isAllVoted()) throw 'some members haven\'t voted yet.'
    if (this.isApproved()) this.emit('approve');
    else this.emit('reject');
  },

  toJson: function (user, options) {
    function toJson(obj) { return obj.toJson(user); }
    options = options || {};
    return {
      id: this.id,
      members: this.members.map(toJson),
      voteMap: options.hideVoteMap ? undefined : this.voteMap,
      areYouVoted: user ? this.isVoted(user) : undefined,
      areYouApproved: user ? this.isApprovedBy(user) : undefined,
      approvalCount: this.approvalCount(),
      rejectionsCount: this.rejectionsCount(),
      requiredApproval: this.requiredApproval,
    };
  },
});

