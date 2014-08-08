var chai = require('chai')
  , sinon = require('sinon')
  , sinonChai = require('sinon-chai');

chai.use(sinonChai);
var expect = chai.expect;

require('../../src/utils/extensions');

var Avalon = require('../../src/models/avalon')
  , User = require('../../src/models/user')
  , RoomObserver = require('../../src/observers/room_observer')
  , Context = require('./context');

exports.Context = Context;

exports.createConnectorDummy = function (ctx) {
  function notice (type, data) {
    for (var id in this.avalon.users) {
      this.avalon.users[id].notify(type, data);
    }
  }

  ctx.connectorCreate = function (avalon) {
    return { avalon: avalon, notice: notice };
  }
}

exports.createRoom = function (ctx) {
  var sockets = ['hoge', 'fuga', 'java', 'gava', 'yaba'].map(function (name) {
    return { id: name, emit: function () {} };
  });
  ctx.sockets = sockets;

  var users = sockets.map(function (socket) {
    return ctx.avalon.login(socket, socket.id);
  });
  ctx.users = users;
  ctx.user = users[0];

  ctx.room = ctx.avalon.createRoom(ctx.user, 'room');
  new RoomObserver(ctx.room, ctx.avalon);

  for (var i = 1; i < users.length; i++) ctx.room.enter(users[i]);
}

exports.orgTeam = function (ctx) {
  var team = ctx.game.currentQuest.team;
  for (var i = 0; i < team.group_sz; i++) {
    team.add_group(ctx.game.currentSelector, ctx.game.players[i]);
  }
  team.go_vote();
}

exports.approveTeam = function (ctx) {
  var team = ctx.game.currentQuest.team;
  for (var i = 0; i < ctx.game.players.length; i++) {
    team.change_voter_map(ctx.game.players[i], true);
  }
  team.judge();
}

exports.successMission = function (ctx) {
  var quest = ctx.game.currentQuest;
  for (var i = 0; i < quest.members.length; i++) {
    quest.change_mission_list(quest.members[i], true);
  }
  quest.judge_success();
}

exports.spyRoomMembers = function (ctx) {
  ctx.users.forEach(function (user) {
    user.socket.emit = sinon.spy();
  });
}
