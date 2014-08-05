var utils = require('../utils');

var TeamObserver = module.exports = function TeamObserver(team, quest, game) {
  this.team = team;
  this.quest = quest;
  this.game = game;
  this.bind();
  this.onNewTeam();
}

utils.extend(TeamObserver.prototype, {
  bind: function () {
    this.team.on('newTeam', this.onNewTeam.bind(this))
    this.team.on('go:vote', this.onGoVote.bind(this))
    this.team.on('add', this.onChangeMember.bind(this))
    this.team.on('remove', this.onChangeMember.bind(this))
    this.team.on('vote', this.onVote.bind(this))
    this.team.on('agree', this.onAgree.bind(this))
    this.team.on('disAgree', this.onDisagree.bind(this))
  },

  onNewTeam: function () {
    var selector = this.team.selector;
    var self = this;
    this.game.players.forEach(function (player) {
      player.notify('new:Team', {
        team: self.team.toJson(player),
      });
    });
  },

  onGoVote: function () {
    this.game.notifyAll('go:vote');
  },

  onVote: function (voter, isAgree) {
    this.game.players.forEach(function (player) {
      player.notify('vote:Team', {
        player: voter.toJson(player),
        isAgree: isAgree,
      });
    });
  },

  onChangeMember: function () {
    if (this.team.isFullMember()) {
      var team = this.team;
      this.game.players.forEach(function (player) {
        members = team.toJson(player).group;
        player.notify('change:Team.members', {
          members: members,
        });
      });
    }
  },

  onAgree: function () {
    this.game.notifyAll('agree:Team', this.team.voter_map);
    this.game.notifyAll('go:vote_result');
  },

  onDisagree: function () {
    this.game.notifyAll('disagree:Team', this.team.voter_map);
    this.game.notifyAll('go:vote_result');
  },
});

