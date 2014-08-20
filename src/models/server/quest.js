var utils = require('../../utils')
  , QuestCore = require('../core/quest')
  , Team = require('./team')
  , Vote = require('./vote')

var Quest = module.exports = utils.inherit(QuestCore, function Quest() {
  var args = Array.prototype.slice.call(arguments)
    , id = utils.randomId();

  args.unshift(id);
  this.superClass.apply(this, args);
});

utils.extend(Quest.classMethods, {
});

utils.extend(Quest.prototype, {
  start: function () {
    this.createTeam();
  },

  createTeam: function () {
    var selector = this.game.nextSelector()
      , team = new Team(this.game, selector, this.memberCount);
    return this.addTeam(team);
  },

  addTeam: function (team) {
    this.superProto.addTeam.apply(this, arguments);
    this.listenTeam(team);
    this.emit('newTeam', team);
    return team;
  },

  listenTeam: function (team) {
    team.on('approve', this.onApproveTeam.bind(this, team));
    team.on('reject', this.onRejectTeam.bind(this, team));
  },

  createMissionVote: function (members) {
    var vote = this.vote = new Vote(members, this.requiredSuccessCount);
    vote.on('approve', this.onSuccess.bind(this, vote));
    vote.on('reject', this.onFailure.bind(this, vote));
    vote.on('vote', this.onVote.bind(this, vote));
    this.state = this.classMethods.States.Mission;
    this.emit('createVote', this.vote);
    return vote;
  },

  onApproveTeam: function (team) {
    this.createMissionVote(team.members);
  },

  onRejectTeam: function (team) {
    if (this.teams.length == 5){
      return this.onAgree(team);
    }
    this.createTeam();
  },

  onSuccess: function (vote) {
    this.state = this.classMethods.States.Success;
    this.emit('success');
  },

  onFailure: function (vote) {
    this.state = this.classMethods.States.Failure;
    this.emit('failure');
  },

  onVote: function (vote, voter, value) {
    this.emit('vote', voter, value);
  },
});
