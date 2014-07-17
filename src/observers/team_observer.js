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
    this.team.on('vote', this.onVote.bind(this))
    this.team.on('agree', this.onAgree.bind(this))
    this.team.on('disAgree', this.onDisagree.bind(this))
  },

  onNewTeam: function () {
    var selector = this.team.selector;
    var self = this;
    this.game.notifyAll('newTeam');
    this.game.players.forEach(function (player) {
      player.notify('selection', {
        selector: selector.toJson(player),
        teamSize: self.team.group_sz,
        successSize: self.quest.success_number,
      });
    });
  },

  onGoVote: function () {
    this.game.notifyAll('go:vote');
  },

  onVote: function (voter, isAgree) {
    this.game.players.forEach(function (player) {
      player.notify('vote', {
        player: voter.toJson(player),
        isAgree: isAgree,
      });
    });
  },

  onAgree: function () {
    this.game.notifyAll('agreeTeam', this.team.voter_map);
  },

  onDisagree: function () {
    this.game.notifyAll('disagreeTeam', this.team.voter_map);
  },
});

