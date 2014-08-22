var utils = require('../../utils')
  , TeamCore = require('../core/team')
  , Vote = require('./vote')

var Team = module.exports = utils.inherit(TeamCore, function Team() {
  var args = Array.prototype.slice.call(arguments)
    , id = utils.randomId();

  args.unshift(id);
  this.superClass.apply(this, args);
});

utils.extend(Team.classMethods, {
});

utils.extend(Team.prototype, {
  createVote: function (members) {
    var players = this.game.players
      , vote = this.vote = new Vote(players, Math.ceil(players.length / 2));
    vote.on('vote', this.onVote.bind(this, vote));
    vote.on('approve', this.onApprove.bind(this, vote));
    vote.on('reject', this.onReject.bind(this, vote));
    return vote;
  },

  goVote: function (selector) {
    if (!this.selector.isSame(selector))
      throw new Error('Only the selector can move the state.');
    if (!this.isFullMember())
      throw new Error('Team members are too few or too many.');
    var vote = this.createVote(this.memberMap);
    this.state = this.classMethods.States.Vote;
    this.emit('go:vote', vote);
  },

  changeMembers: function (selector, members) {
    if (!this.selector.isSame(selector))
      throw new Error('Only the selector can change team members.');
    this.members = members;
    this.emit('changeMembers');
  },

  onApprove: function (vote) {
    this.state = this.classMethods.States.Approve;
    this.emit('approve');
  },

  onReject: function (team) {
    this.state = this.classMethods.States.Reject;
    this.emit('reject');
  },

  onVote: function (vote, voter, value) {
    this.emit('vote', voter, value);
  },
});
