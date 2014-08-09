var helpers = require('../../helpers')
  , chai = require('chai')
  , sinon = require('sinon')
  , events = require('events')
  , sinonChai = require('sinon-chai')
  , RoomModule = require('../../../src/utils/room_module')
  , utils = require('../../../src/utils');

chai.use(sinonChai);
var expect = chai.expect
  , Context = helpers.Context;

describe('RoomModule', function () {
  var ctx;
  beforeEach(function () { ctx = new Context(); });

  beforeEach(function () {
    ctx.User = function (name) {
      this.name = name;
    }
    ctx.Room = function () {
      this.users = [];
    }

    utils.inherit(events.EventEmitter, ctx.User);
    utils.inherit(events.EventEmitter, ctx.Room);
    utils.extend(ctx.Room.prototype, RoomModule('users', 'name'));

    ctx.use('user', function () { return new this.User(this.name); });
    ctx.use('name', 'hoge');
    ctx.use('room', function () { return new this.Room(); });
  });

  describe('#enter', function () {
    it('can enter the room', function () {
      ctx.room.enter(ctx.user);
      expect(ctx.room.users[ctx.name]).to.equal(ctx.user);
    });

    context('when the user destroyed', function () {
      it('leave the room', function () {
        ctx.room.enter(ctx.user);
        expect(ctx.room.users[ctx.name]).to.equal(ctx.user);
        ctx.user.name = null;
        ctx.user.emit('destroy');
        expect(ctx.room.users[ctx.name]).to.not.exist;
      });
    });
  });

  describe('#leave', function () {
    it('can leave the room', function () {
      ctx.room.enter(ctx.user);
      expect(ctx.room.users[ctx.name]).to.equal(ctx.user);
      ctx.room.leave(ctx.user);
      expect(ctx.room.users[ctx.name]).to.not.exist;
    });
  });

  describe('#leaveByIdentifier', function () {
    it('can leave the room', function () {
      ctx.room.enter(ctx.user);
      expect(ctx.room.users[ctx.name]).to.equal(ctx.user);
      ctx.room.leaveByIndetifier(ctx.user.name);
      expect(ctx.room.users[ctx.name]).to.not.exist;
    });
  });
});
