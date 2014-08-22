var utils = require('../../utils')
  , TeamCore = require('../core/team')
  , PlayerSelection = require('./player_selection');


var Team = module.exports = utils.inherit(TeamCore, function Team(database, state, vote) {
  var args = Array.prototype.slice.call(arguments, 3);
  this.superClass.apply(this, args);
  this.database = database;
  this.state = state;
});

utils.extend(Team.classMethods, {
  parseJson: function (json, database, options) {
    var game = (options || {}).parentGame || database.findGame(json.gameId)
      , selector = database.parsePlayer(json.selector)
      , vote = json.vote ? database.parseVote(json.vote, options) : null;

    return new Team(database, json.state, vote,
                    json.id, game, selector, json.teamSize);
  },
});

utils.extend(Team.prototype, {
  memberSelection: function () {
    if (!this.game) return null;
    function read(player) {
      return this.isMember(player);
    }

    function publish(player, value) {
      value ? this.enter(player, false) : this.leave(player, false);
      this.emit('change:Team.playerSelections');
    }

    return new PlayerSelection(this.game.players, this.teamSize, read.bind(this), publish.bind(this));
  },

  memberCandidates: function () {
    return this.memberSelection().candidates;
  },

  /* helper methods */

  amIMember: function () {
    return this.database.playerProfile && this.isMember(this.database.playerProfile);
  },

  amITeamSelector: function () {
    return this.selector.id === this.database.id;
  },

  setVote: function (vote) {
    this.vote = vote;
    this.state = this.classMethods.States.Vote;
    this.vote.on('approve', this.onVoteJudge.bind(this, true));
    this.vote.on('reject', this.onVoteJudge.bind(this, false));
  },

  onVoteJudge: function (isApprove) {
    this.state = isApprove ? this.classMethods.States.Approve : this.classMethods.States.Reject;
  },
});
