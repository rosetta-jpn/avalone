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
    this.team.on('changeMembers', this.onChangeMember.bind(this))
    this.team.on('add', this.onChangeMember.bind(this))
    this.team.on('remove', this.onChangeMember.bind(this))
    this.team.on('vote', this.onVote.bind(this))
    this.team.on('approve', this.onApprove.bind(this))
    this.team.on('reject', this.onReject.bind(this))
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

  onGoVote: function (vote) {
    this.game.notifyAll('go:vote');
    this.game.players.forEach(function (player) {
      player.notify('new:Vote', {
        vote: vote.toJson(player),
      });
    });
  },

  onVote: function (voter, isAgree) {
    var team = this.team;
    this.game.players.forEach(function (player) {
      player.notify('update:Vote', {
        vote: team.toJson(player).vote,
      });
    });
  },

  onChangeMember: function () {
    var team = this.team;
    this.game.players.forEach(function (player) {
      members = team.toJson(player).members;
      player.notify('change:Team.members', {
        members: members,
      });
    });
  },

  onApprove: function () {
    var team = this.team;
    this.game.players.forEach(function (player) {
      members = team.toJson(player).members;
      player.notify('approve:Team', {
        vote: team.toJson().vote,
      });
    });
    this.game.notifyAll('go:vote_result');
  },

  onReject: function () {
    var team = this.team;
    this.game.players.forEach(function (player) {
      members = team.toJson(player).members;
      player.notify('reject:Team', {
        vote: team.toJson().vote,
      });
    });
    this.game.notifyAll('go:vote_result');
  },
});

