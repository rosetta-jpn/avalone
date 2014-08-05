var BasePresenter = require('./base')
  , utils = require('../../utils');

TeamPresenter = module.exports = function (range) {
  this.prepareModel({
    team: this.database.team,
  });
  this.bind(range);

  this.database.on('new:Team', this.changeTeam.bind(this));
}

utils.inherit(BasePresenter, TeamPresenter);

TeamPresenter.prototype.selector = '.rv-team'

TeamPresenter.prototype.changeTeam = function (team) {
  this.model.team = team;
  this.update();
  console.log('Update:Team', this.model);
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
  }
}

