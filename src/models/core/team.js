var utils = require('../../utils')
  , RoomModule = require('../../utils/room_module')
  , events = require('events');

module.exports = Team;
function Team (id, game, selector, teamSize){
  this.id = id;
  this.game = game;
  this.selector = selector;
  this.teamSize = teamSize;
  this.memberMap = {};
  this.state = this.classMethods.States.SelectMember;
}

utils.inherit(events.EventEmitter, Team);
utils.extend(Team.classMethods, {
  States: {
    SelectMember: "SelectMember",
    Vote: "Vote",
    Approve: "Approve",
    Reject: "Reject",
  },
});

utils.extend(Team.prototype, RoomModule('memberMap', 'id'));
utils.property(Team.prototype, {
  members: {
    get: function () { return Object.values(this.memberMap); },
    set: function (members) {
      var memberMap = {};
      for (var i = 0; i < members.length; i++) {
        memberMap[members[i].id] = members[i];
      }
      this.memberMap = memberMap;
    },
  },
});

utils.extend(Team.prototype, {
  isFullMember: function () {
    return this.members.length === this.teamSize;
  },

  isSelectMember: function () {
    return this.state === this.classMethods.States.SelectMember;
  },

  isVoting: function () {
    return this.state === this.classMethods.States.Vote;
  },

  isApprove: function () {
    return this.state === this.classMethods.States.Approve;
  },

  isReject: function () {
    return this.state === this.classMethods.States.Reject;
  },

  isMember: function (player) {
    var members = this.members;
    for (var i = 0; i < members.length; i++) {
      if (members[i].isSame(player)) return true;
    }
    return false;
  },

  toJson: function (user) {
    var toJson = function (obj) { return obj.toJson(user); }
    return {
      id: this.id,
      selector: toJson(this.selector),
      members: this.members.map(toJson),
      teamSize: this.teamSize,
      state: this.state,
      vote: this.vote ? toJson(this.vote) : null,
      gameId: this.game ? this.game.id : null,
    };
  },
});
