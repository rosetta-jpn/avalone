var utils = require('../utils')

/* Public: Controller - dispatches received requests
 * 
 * type - the string which represents the method to handle the request.
 * avalon - the Avalon object.
 * connector - the SocketIOConnector object which received the request.
 * socket - the SocketIO object which represents the sender.
 */
var Controller = module.exports = function Controller(type, avalon, connector, socket) {
  this.type = type;
  this.avalon = avalon;
  this.connector = connector;
  this.socket = socket;
}

/* Public: Run hander method.
 * Run the "this.type + 'Callback'" method as the hander method.
 *
 * data - the received data.
 *
 * Example
 *   controller.type; => 'connection'
 *   controller.dispatch(); => Run the 'connectionCallback'
 */
Controller.prototype.dispatch = function (data) {
  this[this.type + 'Callback'](data);
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
  debugCallback: function () {
    var users = []
    var room = this.avalon.createRoom(this.user, 'debug');
    for (var id in this.avalon.users)
      if (id !== this.id) {
        users.push(this.avalon.users[id]);
        room.enter(this.avalon.users[id]);
      }
    if (users.length < 4) throw new Error('debug fail');
  },

  debugTeamCallback: function () {
    var team = this.game.currentQuest.team;
    for (var i = 0; i < this.game.currentQuest.team_sz; i++) {
       team.add_group(team.selector, this.game.players[i])
    }
    team.go_vote();
  },

  debugVoteCallback: function (isApprove) {
    var team = this.game.currentQuest.team;
    for (var i = 0; i < this.game.players.length; i++) {
       team.change_voter_map(this.game.players[i], isApprove);
    }
    team.judge();
  },

  debugMissionCallback: function (isSuccess) {
    var quest = this.game.currentQuest;
    for (var i = 0; i < quest.members.length; i++) {
       quest.change_mission_list(quest.members[i], isSuccess);
    }
    quest.judge_success();
  },

  connectionCallback: function () {
    this.avalon.login(this.socket, this.id);
  },

  disconnectCallback: function () {
    console.log('Disconnect:', this.user.toJson());
    this.user.disconnect();
  },

  enterCallback: function (data) {
    this.user.rename(data.user.name);
    var roomname = data.room.name;
    var room = this.avalon.rooms[roomname];
    if (room) {
      room.enter(this.user);
    } else {
      this.avalon.createRoom(this.user, data.room.name);
    }
  },

  gameStartCallback: function () {
    this.user.room.newGame(this.user);
  },

  orgTeamCallback: function (data) {
    var selector = this.player, self = this;
    data.group.forEach(function (playerData) {
      var player =  self.game.playerMap[playerData.id];
      self.game.currentQuest.team.add_group(selector, player);
    })
    self.game.currentQuest.team.go_vote();
  },

  approveTeamCallback: function () {
    var team = this.game.currentQuest.team;
    team.change_voter_map(this.player, true);
    if (team.isAllVoted()) team.judge();
  },

  rejectTeamCallback: function () {
    var team = this.game.currentQuest.team;
    team.change_voter_map(this.player, false);
    if (team.isAllVoted()) team.judge();
  },

  successQuestCallback: function () {
    this.game.currentQuest.change_mission_list(this.player, true);
    if (this.game.currentQuest.isAllVoted()) this.game.currentQuest.judge_success();
  },

  failQuestCallback: function () {
    this.game.currentQuest.change_mission_list(this.player, false);
    if (this.game.currentQuest.isAllVoted()) this.game.currentQuest.judge_success();
  },

  assassinateCallback: function (data) {
    var target = this.game.playerMap[data.id];
    this.game.assassinate(this.player, target);
  },
});
