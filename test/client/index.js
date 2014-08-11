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

      expect(ctx.app.database.userProfile.id).to.be.equal(ctx.id);
    });
  });
});
