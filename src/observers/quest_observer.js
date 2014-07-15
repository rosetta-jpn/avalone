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
  },

  onNewQuest: function () {
    this.game.notifyAll('newQuest');
    this.quest.voter_map
  },

  onNewTeam: function (team) {
    this.game.notifyAll('newTeam');
    new TeamObserver(team, this.game);
  },

  onSuccess: function () {
    this.game.notifyAll('successQuest');
  },

  onFailure: function () {
    this.game.notifyAll('failureQuest');
  },
});
