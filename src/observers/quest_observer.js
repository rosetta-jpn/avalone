var utils = require('../utils')
  , TeamObserver = require('./team_observer');

var QuestObserver = module.exports = function QuestObserver(quest, game) {
  this.quest = quest;
  this.game = game;
  this.bind();
  this.onNewQuest();
}

utils.extend(QuestObserver.prototype, {
  bind: function () {
    this.quest.on('newTeam', this.onNewTeam.bind(this))
    this.quest.on('success', this.onSuccess.bind(this))
    this.quest.on('failure', this.onFailure.bind(this))
    this.quest.on('vote:Mission', this.onVoteMission.bind(this))
  },

  onNewQuest: function () {
    var quest = this.quest;
    this.game.players.forEach(function (looker) {
      looker.notify('new:Quest', { quest: quest.toJson(looker) });
    });
  },

  onNewTeam: function (team) {
    new TeamObserver(team, this.quest, this.game);
  },

  onSuccess: function () {
    this.game.notifyAll('successQuest', {
      success: this.quest.successVotes(),
      failure: this.quest.failureVotes(),
    });
  },

  onFailure: function () {
    this.game.players.forEach(function (looker) {
      looker.notify('failureQuest', { quest: quest.toJson(looker) });
    });
  },

  onVoteMission: function (player, vote) {
    player.notify('vote:Mission', {
      player: player.toJson(),
      vote: vote,
    })
  },
});
