var Context = require('../helpers/context')
  , IOHelper = require('../helpers/io_helper')
  , chai = require('chai')
  , sinon = require('sinon')
  , sinonChai = require('sinon-chai');

var App = require('../../src/client/app');

chai.use(sinonChai);
var expect = chai.expect;

describe('Client', function () {
  var ctx;
  beforeEach(function () { ctx = new Context(); });
  beforeEach(function () { ctx.clock = sinon.useFakeTimers(); });
  afterEach(function () { ctx.clock.restore(); });

  beforeEach(function () {
    ctx.use('app', function () { return new App(this.client, this.io) });
    ctx.use('io', function () { return this.ioHelper.createBoot() });
    ctx.use('ioHelper', function () { return new IOHelper(this.clock) });
  });

  afterEach(function () {
    if (ctx.app.router)
      ctx.app.router.unbindPresenters();
  })

  describe('login', function () {
    beforeEach(function () {
      ctx.use('id', 'hoge');
      ctx.use('name', 'owner');
      ctx.use('user', function () { return { id: this.id, name: this.name }; });
      ctx.app.boot();
    });

    it('receive User', function () {
      ctx.ioHelper.sendEvent('connection', ctx.id);
      ctx.ioHelper.sendEvent('enter:User', { user: ctx.user });

      expect(ctx.app.database.userProfile.id).to.equal(ctx.id);
    });
  });

  describe('login and exit', function () {
    beforeEach(function () {
      ctx.use('id', 'hoge'); ctx.use('name', 'owner');
      ctx.use('user', function () { return { id: this.id, name: this.name }; });
      ctx.use('anotherId', 'fuga'); ctx.use('anotherName', 'anotherUser');
      ctx.use('anotherUser', function () { return { id: this.anotherId, name: this.anotherName }; });
      ctx.use('users', function () { return [this.user]; });
      ctx.use('roomName', 'roomname');
      ctx.use('room', function () {
        return {
          owner: this.user,
          name: this.roomName, users: this.users,
        };
      });
      ctx.app.boot();
    });

    context('received a room of anotherUser', function () {
      beforeEach(function () {
        ctx.use('users', function () { return [this.anotherUser]; });
        ctx.use('room', function () {
          return {
            owner: this.anotherUser,
            name: this.roomName, users: this.users,
          };
        });
      });

      it('set the room I enter as currentRoom', function () {
        ctx.ioHelper.sendEvent('connection', ctx.id);
        ctx.ioHelper.sendEvent('new:Room', { room: ctx.room });

        expect(Object.values(ctx.app.database.Room)).to.has.length(1);
        expect(ctx.app.database.currentRoom).to.not.exist;

        ctx.ioHelper.sendEvent('enter:User', { user: ctx.user, roomName: ctx.roomName });

        expect(ctx.app.database.currentRoom.name).to.equal(ctx.room.name);
      });
    });

    it('remove the room when it destroyed', function () {
      ctx.ioHelper.sendEvent('connection', ctx.id);
      ctx.ioHelper.sendEvent('new:Room', { room: ctx.room });
      ctx.ioHelper.sendEvent('enter:User', { user: ctx.user, roomName: ctx.roomName });
      ctx.ioHelper.sendEvent('destroy:Room', { room: ctx.room });

      expect(Object.values(ctx.app.database.Room)).to.has.length(0);
      expect(ctx.app.database.currentRoom).to.not.exist;
    });

    it('leave a user', function () {
      ctx.use('users', function () { return [this.user, this.anotherUser]; });
      ctx.ioHelper.sendEvent('connection', ctx.id);
      ctx.ioHelper.sendEvent('new:Room', { room: ctx.room });
      ctx.ioHelper.sendEvent('enter:User', { user: ctx.anotherUser, roomName: ctx.roomName });

      expect(ctx.app.database.currentRoom.users).to.has.length(2);

      ctx.ioHelper.sendEvent('leave:User', { user: ctx.anotherUser, roomName: ctx.roomName });

      expect(ctx.app.database.currentRoom.users).to.has.length(1);
      expect(ctx.app.database.currentRoom.users[0].id).to.equal(ctx.id);
    });
  });

  describe('resume', function () {
    context('resume a game', function () {
      beforeEach(function () {
        ctx.use('id', 'hoge'); ctx.use('name', 'owner');
        ctx.use('user', function () { return { id: this.id, name: this.name }; });
        ctx.use('users', function () { return [this.user]; });
        ctx.use('roomName', 'roomname');
        ctx.use('room', function () {
          return {
            owner: this.user,
            name: this.roomName, users: this.users,
          };
        });
      })
      context('the game is TeamOrg state', function () {
      });
    });
  });
});
