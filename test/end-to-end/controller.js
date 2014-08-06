var helpers = require('../helpers')
  , chai = require('chai')
  , sinon = require('sinon')
  , sinonChai = require('sinon-chai')
  , Avalon = require('../../src/models/avalon')
  , User = require('../../src/models/user')
  , RoomObserver = require('../../src/observers/room_observer')
  , AvalonObserver = require('../../src/observers/avalon_observer')
  , Controller = require('../../src/server/controller');

chai.use(sinonChai);
var expect = chai.expect
  , Context = helpers.Context;

describe('Controller', function () {
  var ctx;
  beforeEach(function () { ctx = new Context(); });

  beforeEach(function () {
    ctx.use('avalon', function () { return new Avalon(); });
    ctx.use('socket', function () { return this.user.socket; });
    ctx.use('controller', function () {
      return new Controller(this.type, this.avalon, {}, this.socket);
    });
  });

  describe('#connectionCallback', function () {
    beforeEach(function () {
      ctx.spy = sinon.spy();
      ctx.use('avalonObserver', function () {
        return new AvalonObserver(this.avalon, this.connectorCreate);
      });
      ctx.use('socket', function () { return { id: 'hoge', emit: this.spy }; });

      helpers.createConnectorDummy(ctx)
    });

    it('emit', function () {
      ctx.controller.connectionCallback(ctx.data);
      expect(ctx.spy).to.have.been.calledWith('go:start');
    });
  });

  describe('#gameStartCallback', function () {
    beforeEach(function () {
      helpers.createRoom(ctx);
      helpers.spyRoomMembers(ctx);
    });

    it('notify go:jobs', function () {
      ctx.controller.gameStartCallback(ctx.data);
      expect(ctx.room.owner.socket.emit).to.have.been.calledWith('go:jobs');
    });
  });

  describe('#gameStartCallback', function () {
    beforeEach(function () {
      helpers.createRoom(ctx);
      helpers.spyRoomMembers(ctx);
    });

    context('create quest', function () {
      it('notify go:team', function () {
        ctx.game = ctx.room.newGame(ctx.user);
        expect(ctx.game.currentSelector.socket.emit).to.have.been.calledWith('go:team');
      });
    });
  });

  describe('#orgTeamCallback', function () {
    beforeEach(function () {
      ctx.use('game', function () { return this.room.newGame(ctx.user); });
      ctx.use('user', function () { return this.game.currentSelector.user; });
      ctx.use('data', function () { return { players: this.players }; });
      ctx.use('players', function () {
        var players = [];
        for (var i = 0; i < this.game.quests[0].team.group_sz; i++) {
          players.push({ id: this.game.players[i].id });
        }
        return players;
      });

      helpers.createRoom(ctx);
      helpers.spyRoomMembers(ctx);
    });

    it('with no error', function () {
      ctx.controller.orgTeamCallback(ctx.data);
      expect(ctx.user.socket.emit).to.have.been.calledWith('go:vote');
    });
  });

  describe('#approveTeamCallback', function () {
    beforeEach(function () {
      ctx.use('game', function () { return this.room.newGame(ctx.user); });

      helpers.createRoom(ctx);
      helpers.spyRoomMembers(ctx);
      helpers.orgTeam(ctx);
    });

    it('with no error', function () {
      ctx.controller.approveTeamCallback(ctx.data);
      expect(ctx.user.socket.emit).to.have.been.calledWith('vote');
    });
  });
});
