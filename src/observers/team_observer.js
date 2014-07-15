var utils = require('../utils');

var TeamObserver = module.exports = function TeamObserver(team, game) {
  this.team = team;
  this.game = game;
  this.bind();
  this.onNewTeam();
}

utils.extend(TeamObserver.prototype, {
  bind: function () {
    this.team.on('newTeam', this.onNewTeam.bind(this))
    this.team.on('vote', this.onVote.bind(this))
    this.team.on('agree', this.onAgree.bind(this))
    this.team.on('disAgree', this.onDisagree.bind(this))
  },

  onNewTeam: function () {
    this.game.notifyAll('newTeam');
    this.team.selector.notify('go:team');
  },

  onGoVote: function () {
    this.game.notifyAll('go:vote');
  },

  onVote: function (voter, isAgree) {
  },

  onAgree: function () {
    this.game.notifyAll('agreeTeam', this.team.voter_map);
  },

  onDisagree: function () {
    this.game.notifyAll('disagreeTeam', this.team.voter_map);
  },
});

