var Quest = require('../../models/quest')
  , Base = require('./base')
  , TeamReceiver = require('./team_receiver');

var QuestReceiver = module.exports = Base.extend({
  initialize: function (quest) {
    this.quest = quest;

    this.listen(this.client, 'new:Team', this.onNewTeam.bind(this));
    this.listen(this.client, 'vote', this.onVote.bind(this));
    this.listen(this.client, 'succeededQuest', this.onQuestResult.bind(this, true));
    this.listen(this.client, 'failedQuest', this.onQuestResult.bind(this, false));
  },

  onNewTeam: function (json) {
    // switching listener
    var team = this.database.createTeam(json.team);
    this.quest.teams.push(team);
    this.database.currentTeam = team;
    this.quest.emit("update");
    this.listenNewTeam(team);
  },

  listenNewTeam: function (team) {
    var teamReceiver = this.teamReceiver = new TeamReceiver(this.app, team);
    this.quest.emit('new:Quest.team')
    this.quest.once('new:Quest.team', (function () {
      teamReceiver.stopListening();
    }).bind(this));
    return teamReceiver;
  },

  onVote: function (json) {
    var player = this.database.createPlayer(json.player)
    this.quest.change_voter_map(player, json.isAgree);
  },

  onQuestResult: function (isSuccess, json) {
    this.quest.applyResult(isSuccess, json.success, json.failure);
    this.router.reserveChangeScene('mission', 'mission_result');
  },

  onStopListening: function () {
    this.teamReceiver.stopListening();
  },

  resumeQuest: function () {
    this.database.currentTeam = this.quest.team;
    if (this.quest.isOrgTeam()) {
      var teamReceiver = this.listenNewTeam(this.quest.team);
      teamReceiver.resumeTeam();
    } else if (this.quest.isMission()) {
      this.router.changeScene('mission');
    } else if (this.quest.isSuccess() || this.quest.isFailure()) {
      this.router.changeScene('mission_result');
    }
    this.router.applyCurrentModels();
  },
});
