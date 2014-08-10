var Team = require('../../models/quest')
  , Base = require('./base');

var TeamReceiver = module.exports = Base.extend({
  initialize: function (team) {
    this.team = team;
    this.listen(this.client, 'change:Team.members', this.onChangeMembers.bind(this));
    this.listen(this.client, 'vote:Team', this.onVote.bind(this));
    this.listen(this.client, 'agree:Team', this.onAgree.bind(this));
    this.listen(this.client, 'disagree:Team', this.onDisagree.bind(this));
    this.listen(this.team, 'change:Team.playerSelections', this.onChangeSelections.bind(this));
  },

  onAddMember: function (json) {
    this.team.add_group(this.team.selector, this.collection.createPlayer(json.player));
  },

  onRemoveMember: function () {
    this.team.remove_group(this.team.selector, this.collection.createPlayer(json.player));
  },

  onChangeMembers: function (json) {
    var database = this.database;
    var members = json.members.map(function (player) {
      return database.createPlayer(player);
    });
    this.team.members = members;
  },

  onAgree: function () {
    this.team.judge();
  },

  onDisagree: function () {
    this.team.judge();
  },

  onVote: function (json) {
    var player = this.database.createPlayer(json.player);
    this.team.change_voter_map(player, json.isAgree);
  },

  onChangeSelections: function () {
    if (!this.team.isTeamSelector()) return;
    this.client.submit('teamMemberChange', this.team.toJson());
  },

  resumeTeam: function () {
    if (this.team.isSelectMember()) {
      this.router.changeScene('team');
    } else if (this.team.isVoting()) {
      this.router.changeScene('vote');
    } else if (this.team.isApprove() || this.team.isReject()) {
      this.router.changeScene('vote_result');
    }
  },
});
