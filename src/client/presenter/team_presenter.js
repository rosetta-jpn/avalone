var BasePresenter = require('./base')
  , utils = require('../../utils');

var TeamPresenter = module.exports = utils.inherit(BasePresenter);

utils.extend(TeamPresenter.prototype, {
  initialize: function () {
    this.prepareModel({
      team: this.database.team,
    });

    this.database.on('change:currentTeam', this.onChangeCurrentTeam.bind(this));
    this.lock('changeTeam');
  },

  selector: '.rv-team',

  onChangeCurrentTeam: function () {
    this.changeTeam.apply(this, arguments);
  },

  changeTeam: function (team) {
    this.model.team = team;
    this.update();
    utils.log('Update:Team', this.model);
  },

  updateCurrentTeam: function () {
    this.unlock('changeTeam');
    this.lock('changeTeam');
  },

  formatters: {
    toClassName: function (name) { return 'team-' + name; },
    imagePath: function (name) { return 'images/' + name + '.jpg'; },
    showIsApprove: function (isApprove) { return isApprove ? 'Approve' : 'Reject'; },
  },

  eventHandlers: {
    submitTeam: function (ev) {
      ev.preventDefault();
      this.client.submit('orgTeam', this.model.team.toJson());
    },

    submitVote : function(ev){
      ev.preventDefault();
      if (this.model.team.vote.approveCheck) {
        this.client.submit('approveTeam', this.model.team.toJson());
      } else if (this.model.team.vote.rejectCheck) {
        this.client.submit('rejectTeam', this.model.team.toJson());
      }
    },
  },
});

