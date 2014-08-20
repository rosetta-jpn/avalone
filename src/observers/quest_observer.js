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
    this.quest.on('vote', this.onVoteMission.bind(this))
    this.quest.on('createVote', this.onCreateVote.bind(this))
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
    var quest = this.quest;
    this.game.players.forEach(function (looker) {
      looker.notify('succeededQuest', {
        vote: quest.toJson(looker).vote,
      });
    });
  },

  onFailure: function () {
    var quest = this.quest;
    this.game.players.forEach(function (looker) {
      looker.notify('failedQuest', {
        vote: quest.toJson(looker).vote,
      });
    });
  },

  onVoteMission: function (player, isSuccess) {
    player.notify('vote:Mission', {
      player: player.toJson(),
      isSuccess: isSuccess,
    })
  },

  onCreateVote: function (vote) {
    var self = this;
    this.game.players.forEach(function (looker) {
      looker.notify('new:MissionVote', { vote: self.quest.toJson(looker).vote });
    });
  },
});
