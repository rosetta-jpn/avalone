var utils = require('../../utils')
  , QuestCore = require('../core/quest');

var Quest = module.exports =
  utils.inherit(QuestCore, function Quest(database, state) {
  var args = Array.prototype.slice.call(arguments, 2);
  this.superClass.apply(this, args);
  this.database = database;
  this.state = state || this.state;
});

utils.extend(Quest.classMethods, {
  parseJson: function (json, database, options) {
    var game = (options || {}).parentGame || database.findGame(json.gameId)
      , state = json.state;

    var quest = new Quest(database, state, json.id, game, json.requiredSuccessCount, json.memberCount);
    quest.teams = (json.teams || []).map(function (team) {
      return database.parseTeam(team, options);
    });
    if (json.vote) quest.vote = database.parseSecretVote(json.vote, options);
    return quest;
  },
});

utils.extend(Quest.prototype, {
  addMissionVote: function (vote) {
    this.vote = vote;
    this.vote.on('approve', this.onVoteJudge.bind(this, true));
    this.vote.on('reject', this.onVoteJudge.bind(this, false));
  },

  onVoteJudge: function (isSuccess) {
    this.state = isSuccess ? this.classMethods.States.Success : this.classMethods.States.Failure;
    this.emit(isSuccess ? 'success' : 'failure')
  },

  addTeam: function () {
    this.superProto.addTeam.apply(this, arguments);
    this.emit('update');
  },

  /* helper methods */

  amIMember: function () {
    return this.currentTeam.amIMember();
  },

  result: function () {
    if (this.isSuccess()) {
      return 'Success'
    } else if (this.isFailure()) {
      return 'Failure'
    } else {
      return 'Now';
    }
  },

  pastTeamLogs: function(){
    var pastTeams = [];
    for (var i = 0; i < this.teams.length; i++) {
      if (this.teams[i].isApprove() || this.teams[i].isReject()) {
        pastTeams.push({ team: this.teams[i], index: i + 1 });
      }
    }
    return pastTeams;
  },
});

