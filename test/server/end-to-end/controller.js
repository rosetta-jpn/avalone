var helpers = require('../helpers')
  , chai = require('chai')
  , sinon = require('sinon')
  , sinonChai = require('sinon-chai');

var Requirements = require('../helpers/requirements');

var Avalon = Requirements.Models.Avalon
  , User = Requirements.Models.User
  , RoomObserver = Requirements.Observers.RoomObserver
  , AvalonObserver = Requirements.Observers.AvalonObserver
  , Config = Requirements.Server.Config
  , Controller = Requirements.Server.Controller

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
      return new Controller(this.type, this.avalon, {}, this.socket, this.config);
    });
    ctx.use('config', function () { return new Config(); });
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

    xit('emit', function () {
      ctx.controller.connectionCallback(ctx.data);
      expect(ctx.spy).to.have.been
        .calledWith('event', sinon.match.has('type', 'go:start'));
    });
  });

  describe('#gameStartCallback', function () {
    beforeEach(function () {
      helpers.createRoom(ctx);
      helpers.spyRoomMembers(ctx);

      ctx.use('user', function () { return ctx.owner; });
    });

    it('notify go:jobs', function () {
      ctx.controller.gameStartCallback(ctx.data);
      expect(ctx.room.owner.socket.emit).to.have.been
        .calledWith('event', sinon.match.has('type', 'go:jobs'));
    });

    context('create quest', function () {
      xit('notify go:team', function () {
        ctx.game = ctx.room.newGame(ctx.user);
        expect(ctx.game.currentSelector.socket.emit).to.have.been
          .calledWith('event', sinon.match.has('type', 'go:team'));
      });
    });
  });

  describe('#orgTeamCallback', function () {
    beforeEach(function () {
      helpers.createRoom(ctx);
      helpers.spyRoomMembers(ctx);

      ctx.use('game', function () { return this.room.newGame(ctx.owner); });
      ctx.use('players', function () {
        var players = [];
        for (var i = 0; i < this.game.currentQuest.currentTeam.teamSize; i++) {
          players.push({ id: this.game.players[i].id });
        }
        return players;
      });
      ctx.use('data', function () { return { members: this.players }; });
      ctx.use('user', function () { return this.game.currentSelector; });
    });

    it('with no errors', function () {
      ctx.controller.orgTeamCallback(ctx.data);
      expect(ctx.user.socket.emit).to.have.been
        .calledWith('event', sinon.match.has('type', 'go:vote'));
    });
  });

  describe('#approveTeamCallback', function () {
    beforeEach(function () {
      ctx.use('game', function () { return this.room.newGame(ctx.owner); });
      ctx.use('user', function () { return this.game.currentSelector; });

      helpers.createRoom(ctx);
      helpers.spyRoomMembers(ctx);
      helpers.orgTeam(ctx);
    });

    it('with no errors', function () {
      ctx.controller.approveTeamCallback(ctx.data);
      expect(ctx.user.socket.emit).to.have.been
        .calledWith('event', sinon.match.has('type', 'vote:Team'));
    });
  });

  describe('#successQuestCallback', function () {
    beforeEach(function () {
      ctx.use('game', function () { return this.room.newGame(ctx.owner); });
      ctx.use('data', function () { return {}; });
      ctx.use('user', function () { return this.members[0].user; });

      helpers.createRoom(ctx);
      helpers.spyRoomMembers(ctx);
      helpers.orgTeam(ctx);
      helpers.approveTeam(ctx);
    });

    it('with no error', function () {
      ctx.controller.successQuestCallback(ctx.data);
      expect(ctx.user.socket.emit).to.have.been
        .calledWith('event', sinon.match.has('type', 'vote:Mission'));
    });

    context('approve all members', function () {
      beforeEach(function () {
        ctx.use('members', function () { return this.game.currentQuest.vote.members; })
        ctx.use('user', function () { return this.members[0]; });
        var quest = ctx.game.currentQuest;
        for (var i = 1; i < ctx.members.length; i++) {
          quest.vote.vote(ctx.members[i], true);
        }
      });

      it ('receive successQuest', function () {
        ctx.controller.successQuestCallback(ctx.data);
        expect(ctx.user.socket.emit).to.have.been
          .calledWith('event', sinon.match.has('type', 'succeededQuest'));
      });

      it ('create next Quest', function () {
        ctx.controller.successQuestCallback(ctx.data);
        expect(ctx.room.game.quests).to.have
          .length(2);
      });
    });

    context('approve Three times', function () {
      beforeEach(function () {
        ctx.use('assassin', function () { return this.room.game.findAssassin(); })
        ctx.use('noAssasinPlayer', function () {
          var players = this.room.game.players;
          for (var i = 0; i < players.length; i++) {
            if (players[i] !== this.assassin) return players[i];
          }
        });

        helpers.successMission(ctx);
        for (var i = 0; i < 2; i++) {
          helpers.orgTeam(ctx);
          helpers.approveTeam(ctx);
          helpers.successMission(ctx);
        }
      });

      it ('go to assassin phase', function () {
        expect(ctx.room.game.isAssassin()).to.be.true;
        expect(ctx.noAssasinPlayer.user.socket.emit).to.have.been
          .calledWith('event', sinon.match.has('type', 'go:AssassinPhase'));
        expect(ctx.assassin.user.socket.emit).to.have.been
          .calledWith('event', sinon.match.has('type', 'go:AssassinVote'));
      });

      context('assassinate', function () {
        beforeEach(function () {
          ctx.use('user', function () { return this.assassin.user; });
          ctx.use('merlin', function () {
            var players = this.room.game.players;
            for (var i = 0; i < players.length; i++) {
              if (players[i].isMerlin) return players[i];
            }
          });
        });

        it ('evilwin', function () {
          ctx.controller.assassinateCallback(ctx.merlin.toJson());
          expect(ctx.user.socket.emit).to.have.been
            .calledWith('event', sinon.match.has('type', 'go:game_result'));
          expect(ctx.user.socket.emit).to.have.been
            .calledWith('event', sinon.match.has('type', 'evilWin'));
        });
      });
    });
  });
});
