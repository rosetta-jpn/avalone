var Base = require('./base')
  , TeamReceiver = require('./team_receiver');

var QuestReceiver = module.exports = Base.extend({
  initialize: function (quest) {
    this.quest = quest;

    this.listen(this.client, 'new:Team', this.onNewTeam.bind(this));
    this.listen(this.client, 'new:MissionVote', this.onMissionVote.bind(this));
    this.listen(this.client, 'update:MissionVote', this.onUpdateMissionVote.bind(this));
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
    var teamReceiver = this.teamReceiver = new TeamReceiver(this.app, this.quest, team);
    return teamReceiver;
  },

  onMissionVote: function (json) {
    var secretVote = this.database.createSecretVote(json.vote);
    this.quest.addMissionVote(secretVote);
  },

  onUpdateMissionVote: function (json) {
    this.database.updateSecretVote(json.vote);
  },

  onQuestResult: function (isSuccess, json) {
    this.database.updateSecretVote(json.vote);
    this.quest.vote.judge();
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

  afterAction: function () {
    this.quest.emit('update');
    if (this.quest.vote) this.quest.vote.emit('update');
    if (this.quest.game) this.quest.game.emit('update');
  },
});
