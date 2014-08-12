var BasePresenter = require('./base')
  , utils = require('../../utils');

TeamPresenter = module.exports = function (range) {
  this.prepareModel({
    team: this.database.team,
  });
  this.bind(range);

  this.database.on('change:currentTeam', this.onChangeCurrentTeam.bind(this));
  this.lock('changeTeam');
}

utils.inherit(BasePresenter, TeamPresenter);

TeamPresenter.prototype.selector = '.rv-team'
TeamPresenter.prototype.onChangeCurrentTeam = function () {
  this.changeTeam.apply(this, arguments);
}
TeamPresenter.prototype.changeTeam = function (team) {
  this.model.team = team;
  this.update();
  console.log('Update:Team', this.model);
}

TeamPresenter.prototype.updateCurrentTeam = function () {
  this.unlock('changeTeam');
  this.lock('changeTeam');
}

TeamPresenter.prototype.formatters = {
  toClassName: function (name) { return 'team-' + name; },
  imagePath: function (name) { return 'images/' + name + '.jpg'; },
  showIsApprove: function (isApprove) { return isApprove ? 'Approve' : 'Reject'; },
}

TeamPresenter.prototype.eventHandlers = {
  submitTeam: function (ev) {
    ev.preventDefault();
    this.client.submit('orgTeam', this.model.team.toJson());
  },

  submitVote : function(ev){
    ev.preventDefault();
    if(this.model.team.isVoteApprove){
      this.client.submit('approveTeam', this.model.team.toJson());
    }else{
      this.client.submit('rejectTeam', this.model.team.toJson()); 
    }
    this.model.team.isVoted = true;
  },
}

