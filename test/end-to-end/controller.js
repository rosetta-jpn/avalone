var helper = require('../helper')
  , chai = require('chai')
  , sinon = require('sinon')
  , sinonChai = require('sinon-chai')
  , Avalon = require('../../src/models/avalon')
  , User = require('../../src/models/user')
  , RoomObserver = require('../../src/observers/room_observer')
  , AvalonObserver = require('../../src/observers/avalon_observer')
  , Controller = require('../../src/server/controller');

chai.use(sinonChai);
var expect = chai.expect;

describe('Controller', function () {
  var controller;
  var avalon;
  var ctx = {};

  afterEach(function () {
    ctx = {};
  });

  beforeEach(function () {
    var socket = ctx.user ? ctx.user.socket : {}
    controller = new Controller(ctx.type, ctx.data, ctx.avalon, {}, ctx.socket || socket);
  });

  describe('#connectionCallback', function () {
    before(function () {
      ctx.spy = sinon.spy();
      ctx.avalon = ctx.avalon || new Avalon();
      helper.createConnectorDummy(ctx)
      new AvalonObserver(ctx.avalon, ctx.connectorCreate);
      ctx.socket = { id: 'hoge', emit: ctx.spy };
    });

    it('emit', function () {
      controller.connectionCallback();
      expect(ctx.spy).to.have.been.calledWith('go:start');
    });
  });

  describe('#gameStartCallback', function () {
    before(function () {
      helper.createRoom(ctx);
      helper.spyRoomMembers(ctx);
    });

    it('notify go:jobs', function () {
      controller.gameStartCallback();
      expect(ctx.room.owner.socket.emit).to.have.been.calledWith('go:jobs');
    });
  });

  describe('#gameStartCallback', function () {
    before(function () {
      helper.createRoom(ctx);
      helper.spyRoomMembers(ctx);
    });

    context('create quest', function () {
      it('notify go:team', function () {
        ctx.game = ctx.room.newGame(ctx.user);
        expect(ctx.game.currentSelector.socket.emit).to.have.been.calledWith('go:team');
      });
    });
  });

  describe('#orgTeamCallback', function () {
    before(function () {
      var players = [];
      helper.createRoom(ctx);
      helper.spyRoomMembers(ctx);
      ctx.game = ctx.room.newGame(ctx.user);

      ctx.user = ctx.game.currentSelector.user;
      ctx.data = { players: players };
      for (var i = 0; i < ctx.game.quests[0].team.group_sz; i++) {
        players.push({ id: ctx.game.players[i].id });
      }
    });

    it('with no error', function () {
      controller.orgTeamCallback();
      expect(ctx.user.socket.emit).to.have.been.calledWith('go:vote');
    });
  });

  describe('#voteApproveCallback', function () {
    before(function () {
      helper.createRoom(ctx);
      helper.spyRoomMembers(ctx);
      ctx.game = ctx.room.newGame(ctx.user);

      for (var i = 0; i < ctx.game.quests[0].team.group_sz; i++) {
        ctx.game.quests[0].team.add_group(ctx.game.currentSelector, ctx.game.players[i]);
      }
    });

    it('with no error', function () {
      controller.voteApproveCallback();
      expect(ctx.user.socket.emit).to.have.been.calledWith('vote');
    });
  });
});
