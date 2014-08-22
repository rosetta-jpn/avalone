var chai = require('chai')
  , sinon = require('sinon')
  , sinonChai = require('sinon-chai');

chai.use(sinonChai);
var expect = chai.expect;

var utils = require('../../../src/utils');
utils.disableLog();

var Requirements = require('./requirements')
  , Context = require('../../helpers/context');

var Avalon = Requirements.Models.Avalon
  , RoomObserver = Requirements.Observers.RoomObserver;

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
  ctx.use('connector', function () {
    var self = this;
    function notifyAll(type, data) {
      for (var i = 0; i < self.users.length; i++) {
        self.users[i].notify(type, data)
      }
    }
    return { notifyAll: notifyAll, };
  });

  ctx.use('sockets', function () {
    return ['hoge', 'fuga', 'java', 'gava', 'yaba'].map(function (name) {
      return { id: name, emit: function () {} };
    });
  });

  ctx.use('users', function () {
    var self = this;
    return this.sockets.map(function (socket) {
      return self.avalon.login(socket, socket.id);
    });
  });
  ctx.use('owner', function () { return this.users[0]; })

  ctx.room = ctx.avalon.createRoom(ctx.owner, 'room');
  new RoomObserver(ctx.room, ctx.avalon, ctx.connector);

  for (var i = 1; i < ctx.users.length; i++) ctx.room.enter(ctx.users[i]);
}

exports.orgTeam = function (ctx) {
  ctx.use('members', function () {
    var team = this.game.currentQuest.currentTeam;
    var members = [];
    for (var i = 0; i < team.teamSize; i++) {
      members.push(this.game.players[i]);
    }
    return members;
  });
  ctx.use('selector', function () { return this.game.currentSelector; });

  var team = ctx.game.currentQuest.currentTeam;
  team.changeMembers(ctx.selector, ctx.members);
  team.goVote(ctx.selector);
}

exports.approveTeam = function (ctx) {
  var team = ctx.game.currentQuest.currentTeam;
  for (var i = 0; i < ctx.game.players.length; i++) {
    team.vote.vote(ctx.game.players[i], true);
  }
  team.vote.judge();
}

exports.successMission = function (ctx) {
  var quest = ctx.game.currentQuest;
  for (var i = 0; i < quest.vote.members.length; i++) {
    quest.vote.vote(quest.vote.members[i], true);
  }
  quest.vote.judge();
}

exports.spyRoomMembers = function (ctx) {
  ctx.users.forEach(function (user) {
    user.socket.emit = sinon.spy();
  });
}
