var Base = require('./base')

var TeamReceiver = module.exports = Base.extend({
  // TODO: emit update automatically
  initialize: function (quest, team) {
    this.quest = quest;
    this.team = team;
    this.listen(this.client, 'change:Team.members', this.onChangeMembers.bind(this));
    this.listen(this.client, 'approve:Team', this.onApprove.bind(this));
    this.listen(this.client, 'reject:Team', this.onReject.bind(this));
    this.listen(this.client, 'new:Vote', this.onReceiveVote.bind(this));
    this.listen(this.client, 'update:Vote', this.onUpdateVote.bind(this));
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
    this.stopListening()
    this.quest.emit('update');
  },

  onReject: function (json) {
    this.database.updateVote(json.vote);
    this.team.vote.judge();
    this.stopListening()
    this.quest.emit('update');
  },

  onReceiveVote: function (json) {
    var vote = this.database.createVote(json.vote);
    this.team.setVote(vote);
  },

  onUpdateVote: function (json) {
    this.database.updateVote(json.vote);
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

  beforeAction: function (next, json) {
    if (json && json.team && json.team.id !== this.team.id) return;
    next();
  },
});
