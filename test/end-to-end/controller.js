var chai = require('chai')
  , sinon = require('sinon')
  , sinonChai = require('sinon-chai')
  , Avalon = require('../../src/models/avalon')
  , User = require('../../src/models/user')
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

  xdescribe('#gameStartCallback', function () {
    before(function () {
      ctx.avalon = ctx.avalon || new Avalon();
      var sockets = ['hoge', 'fuga', 'java', 'gava', 'yaba'].map(function (name) {
        return { id: name };
      });
      ctx.socket = socket[0];
      var users = sockets.map(function (socket) {
        return new User(socket.id, socket.id, socket);
      });
      ctx.user = users[0];

      room = ctx.avalon.createRoom(ctx.user, 'room');
      for (var i = 1; i < users.length; i++) room.enter(users[i]);
    });

    it('#gameStartCallback', function () {
      controller.gameStartCallback();
    });
  });

});
