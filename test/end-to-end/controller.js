var helper = require('../helper')
  , chai = require('chai')
  , sinon = require('sinon')
  , sinonChai = require('sinon-chai')
  , Avalon = require('../../src/models/avalon')
  , User = require('../../src/models/user')
  , RoomObserver = require('../../src/observers/room_observer')
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
    controller = new Controller(ctx.type, ctx.data, ctx.avalon, {}, ctx.socket);
    controller._user = ctx.user || new User(ctx.socket.id, ctx.username, ctx.socket);
  });

  describe('#connectionCallback', function () {
    before(function () {
      ctx.spy = sinon.spy();
      ctx.avalon = ctx.avalon || new Avalon();
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

});
