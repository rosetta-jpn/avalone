var utils = require('../utils');

/* Public: Controller - dispatches received requests
 *
 * type - the string which represents the method to handle the request.
 * avalon - the Avalon object.
 * connector - the SocketIOConnector object which received the request.
 * socket - the SocketIO object which represents the sender.
 */
var Controller = module.exports = function Controller(type, avalon, connector, socket, config) {
  this.type = type;
  this.avalon = avalon;
  this.connector = connector;
  this.config = config;
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

Controller.prototype.refuseProduction = function () {
  if (this.config.isProduction()) throw 'Development Only';
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
    this.refuseProduction();
    this.user.rename('owner');
    var room = this.avalon.rooms['debug']
    if (room) room.destroy();
    room = this.avalon.createRoom(this.user, 'debug');
    var users = []
    for (var id in this.avalon.users)
      if (id !== this.id) {
        users.push(this.avalon.users[id]);
        room.enter(this.avalon.users[id]);
      }
    if (users.length < 4) throw new Error('debug fail');
  },

  debugTeamCallback: function () {
    this.refuseProduction();
    this.game.notifyAll('changeScene', 'team');
    var team = this.game.currentQuest.currentTeam;
    var members = [];
    for (var i = 0; i < this.game.currentQuest.memberCount; i++)
      members.push(this.game.players[i]);

    team.changeMembers(team.selector, members);
    team.goVote(team.selector);
  },

  debugVoteCallback: function (isApprove) {
    this.refuseProduction();
    this.game.notifyAll('changeScene', 'vote');
    var team = this.game.currentQuest.currentTeam;
    for (var i = 0; i < this.game.players.length; i++) {
       team.vote.vote(this.game.players[i], isApprove);
    }
    team.vote.judge();
  },

  debugMissionCallback: function (isSuccess) {
    this.refuseProduction();
    this.game.notifyAll('changeScene', 'mission');
    var quest = this.game.currentQuest;
    for (var i = 0; i < quest.vote.members.length; i++) {
       quest.vote.vote(quest.vote.members[i], isSuccess);
    }
    quest.vote.judge();
  },

  connectionCallback: function () {
    this.avalon.login(this.socket, this.id);
  },

  disconnectCallback: function () {
    utils.log('Disconnect:', this.user.toJson());
    this.user.disconnect();
  },

  enterCallback: function (data) {
    this.user.rename(data.user.name);
    var roomname = data.room.name;
    var room = this.avalon.rooms[roomname];
    if (room) {
      room.enterOrRelogin(this.user);
    } else {
      this.avalon.createRoom(this.user, data.room.name);
    }
  },

  gameStartCallback: function () {
    this.user.room.newGame(this.user);
  },

  /* Public: Change Team Members. */
  teamMemberChangeCallback: function (data) {
    var self = this;
    var members = data.members.map(function (playerData) {
      return self.game.playerMap[playerData.id];
    });
    this.game.currentQuest.currentTeam.changeMembers(this.player, members);
  },

  /* Public: Organize the team and go to vote state. */
  orgTeamCallback: function (data) {
    this.teamMemberChangeCallback(data);
    var team = this.game.currentQuest.currentTeam;
    team.goVote(this.player);
  },

  /* Public: Vote for the team. */
  approveTeamCallback: function () {
    var team = this.game.currentQuest.currentTeam;
    team.vote.vote(this.player, true);
    if (team.vote.isAllVoted()) team.vote.judge();
  },

  /* Public: Vote against the team. */
  rejectTeamCallback: function () {
    var team = this.game.currentQuest.currentTeam;
    team.vote.vote(this.player, false);
    if (team.vote.isAllVoted()) team.vote.judge();
  },

  successQuestCallback: function () {
    this.game.currentQuest.vote.vote(this.player, true);
    if (this.game.currentQuest.vote.isAllVoted()) this.game.currentQuest.vote.judge();
  },

  failQuestCallback: function () {
    this.game.currentQuest.vote.vote(this.player, false);
    if (this.game.currentQuest.vote.isAllVoted()) this.game.currentQuest.vote.judge();
  },

  assassinateCallback: function (data) {
    var target = this.game.playerMap[data.id];
    this.game.assassinate(this.player, target);
  },
});
