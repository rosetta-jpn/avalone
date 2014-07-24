var Team = require('../../models/quest')
  , Base = require('./base');

var TeamReceiver = module.exports = Base.extend({
  initialize: function (team) {
    this.team = team;
    this.listen(this.client, 'vote:Team', this.onVote.bind(this));
    this.listen(this.client, 'agree:Team', this.onAgree.bind(this));
    this.listen(this.client, 'disagree:Team', this.onDisagree.bind(this));
  },

  onAddMember: function (json) {
    this.team.add_group(this.team.selector, this.collection.createPlayer(json.player));
  },

  onRemoveMember: function () {
    this.team.remove_group(this.team.selector, this.collection.createPlayer(json.player));
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
});
