var utils = require('../../utils')
  , events = require('events');

module.exports = Quest;
function Quest(id, game, requiredSuccessCount, memberCount) {
  this.id = id;
  this.game = game;
  this.requiredSuccessCount = requiredSuccessCount;
  this.memberCount = memberCount;
  this.teams = [];
  this.state = this.classMethods.States.OrgTeam;
}

utils.inherit(events.EventEmitter, Quest);
utils.extend(Quest.classMethods, {
  States: {
    OrgTeam: 'OrgTeam',
    Mission: 'Mission',
    Success: 'Success',
    Failure: 'Failure',
  },
});

utils.extend(Quest.prototype, {
  addTeam: function (team) {
    this.teams.push(team);
  },

  isOrgTeam: function () {
    return this.state === this.classMethods.States.OrgTeam;
  },

  isMission: function () {
    return this.state === this.classMethods.States.Mission;
  },

  isSuccess: function () {
    return this.state === this.classMethods.States.Success;
  },

  isFailure: function () {
    return this.state === this.classMethods.States.Failure;
  },

  toJson: function (user) {
    var toJson = function (obj) { return obj.toJson(user); }
    return {
      id: this.id,
      requiredSuccessCount: this.requiredSuccessCount,
      memberCount: this.memberCount,
      teams: this.teams.map(toJson),
      state: this.state,
      vote: this.vote ? this.vote.toJson(user, { hideVoteMap: true }) : null,
      gameId: this.game ? this.game.id : null,
    };
  },
});

utils.property(Quest.prototype, {
  currentTeam: {
    get: function () { return this.teams[this.teams.length - 1]; },
  },
});
