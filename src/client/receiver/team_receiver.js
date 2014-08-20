var Base = require('./base');

var TeamReceiver = module.exports = Base.extend({
  initialize: function (team) {
    this.team = team;
    this.listen(this.client, 'change:Team.members', this.onChangeMembers.bind(this));
    this.listen(this.client, 'vote:Team', this.onVote.bind(this));
    this.listen(this.client, 'approve:Team', this.onApprove.bind(this));
    this.listen(this.client, 'reject:Team', this.onReject.bind(this));
    this.listen(this.client, 'new:Vote', this.onReceiveVote.bind(this));
    this.listen(this.team, 'change:Team.playerSelections', this.onChangeSelections.bind(this));
  },

  onChangeMembers: function (json) {
    var database = this.database;
    var members = json.members.map(function (player) {
      return database.createPlayer(player);
    });
    this.team.members = members;
  },

  onApprove: function (json) {
    this.database.updateVote(json.vote);
    this.team.vote.judge();
  },

  onReject: function (json) {
    this.database.updateVote(json.vote);
    this.team.vote.judge();
  },

  onVote: function (json) {
    var player = this.database.createPlayer(json.player);
    this.team.vote.vote(player, json.isAgree);
  },

  onReceiveVote: function (json) {
    var vote = this.database.createVote(json.vote);
    this.team.setVote(vote);
  },

  onChangeSelections: function () {
    if (!this.team.amITeamSelector()) return;
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

  afterAction: function () {
    this.team.emit('update');
    if (this.team.vote) this.team.vote.emit('update');
  },
});
