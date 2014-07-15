var utils = require('../utils')

var Controller = module.exports = function Controller(type, data, avalon, connector, socket) {
  this.type = type;
  this.data = data;
  this.avalon = avalon;
  this.connector = connector;
  this.socket = socket;
}

Controller.prototype.dispatch = function () {
  this[this.type + 'Callback']();
}

utils.property(Controller.prototype, {
  id: {
    get: function () { return this.socket.id; },
  },
  user: {
    get: function () { return this._user = this._user || this.avalon.users[this.id]; },
  },
  player: {
    get: function () {
      return this._player = this._player || this.user.room.game.playerMap[this.id];
    },
  },
  game: {
    get: function () {
      return this._game = this._game || this.user.room.game;
    },
  },
})

utils.extend(Controller.prototype, {
  connectionCallback: function () {
    this.avalon.login(this.socket, this.id);
    this.user.notify('go:start');
  },

  disconnectCallback: function () {
    console.log('Disconnect:', this.user.toJson());
    this.user.disconnect();
  },

  enterCallback: function () {
    this.user.rename(this.data.user.name);
    var roomname = this.data.room.name;
    var room = this.avalon.rooms[roomname];
    if (room) {
      room.enter(this.user);
    } else {
      this.avalon.createRoom(this.user, this.data.room.name);
    }
    this.user.notify('go:lobby');
  },

  gameStartCallback: function () {
    this.user.room.newGame(this.user);
  },

  orgTeamCallback: function () {
    var selector = this.player, self = this;
    this.data.players.forEach(function (playerData) {
      var player =  self.game.playerMap[playerData.id];
      self.game.currentQuest.team.add_group(selector, player);
    })
    self.game.currentQuest.team.go_vote();
  },

  voteApproveCallback: function () {
    debugger;
    this.game.currentQuest.team.change_voter_map(this.player, true);
  },

  voteRejectCallback: function () {
    this.game.currentQuest.team.change_voter_map(this.player, false);
  },
});
