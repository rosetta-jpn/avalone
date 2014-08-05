var Quest = require('../../models/quest')
  , Base = require('./base')
  , TeamReceiver = require('./team_receiver');

var QuestReceiver = module.exports = Base.extend({
  initialize: function (quest) {
    this.quest = quest;

    this.listen(this.client, 'new:Team', this.onNewTeam.bind(this));
    this.listen(this.client, 'vote', this.onVote.bind(this));
  },

  onNewTeam: function (json) {
    // switching listener
    var team = this.database.createTeam(json.team);
    this.quest.team = team;

    this.database.currentTeam = team;
    var teamReceiver = new TeamReceiver(team);

    this.quest.emit('new:Quest.team')
    this.quest.once('new:Quest.team', function () {
      teamReceiver.stopListening();
    })
  },

  onVote: function (json) {
    var player = this.database.createPlayer(json.player)
    this.quest.change_voter_map(player, json.isAgree);
  },

});
