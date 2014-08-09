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
      ctx.use('game', function () { return this.room.newGame(ctx.user); });
      ctx.use('user', function () { return this.game.currentSelector.user; });
      ctx.use('data', function () { return { group: this.players }; });
      ctx.use('players', function () {
        var players = [];
        for (var i = 0; i < this.game.currentQuest.team.group_sz; i++) {
          players.push({ id: this.game.players[i].id });
        }
        return players;
      });

      helpers.createRoom(ctx);
      helpers.spyRoomMembers(ctx);
    });

    it('with no error', function () {
      ctx.controller.orgTeamCallback(ctx.data);
      expect(ctx.user.socket.emit).to.have.been
        .calledWith('event', sinon.match.has('type', 'go:vote'));
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
      expect(ctx.user.socket.emit).to.have.been
        .calledWith('event', sinon.match.has('type', 'vote:Team'));
    });
  });

  describe('#successQuestCallback', function () {
    beforeEach(function () {
      ctx.use('game', function () { return this.room.newGame(ctx.user); });
      ctx.use('data', function () { return {}; });

      helpers.createRoom(ctx);
      helpers.spyRoomMembers(ctx);
      helpers.orgTeam(ctx);
      helpers.approveTeam(ctx);
    });

    it('with no error', function () {
      ctx.user = ctx.game.currentQuest.members[0].user;
      console.log(ctx.user);
      ctx.controller.successQuestCallback(ctx.data);
      expect(ctx.user.socket.emit).to.have.been
        .calledWith('event', sinon.match.has('type', 'vote:Mission'));
    });

    context('approve all members', function () {
      beforeEach(function () {
        var quest = ctx.game.currentQuest;
        for (var i = 1; i < quest.members.length; i++) {
          quest.change_mission_list(quest.members[i], true);
        }
        ctx.user = ctx.game.currentQuest.members[0].user;
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
        helpers.successMission(ctx);
        for (var i = 0; i < 2; i++) {
          helpers.orgTeam(ctx);
          helpers.approveTeam(ctx);
          helpers.successMission(ctx);
        }
      });

      it ('go to assassin phase', function () {
        var assassin = ctx.room.game.findAssassin();
        var noAssasinPlayer = (function () {
          var players = ctx.room.game.players;
          for (var i = 0; i < players.length; i++) {
            if (players[i] !== assassin) return players[i];
          }
        })();

        expect(ctx.room.game.isAssassin()).to.be.true;
        expect(noAssasinPlayer.user.socket.emit).to.have.been
          .calledWith('event', sinon.match.has('type', 'go:AssassinPhase'));
        expect(assassin.user.socket.emit).to.have.been
          .calledWith('event', sinon.match.has('type', 'go:AssassinVote'));
      });

      context('assassinate', function () {
        it ('evilwin', function () {
          var assassin = ctx.room.game.findAssassin();
          var merlin = (function () {
            var players = ctx.room.game.players;
            for (var i = 0; i < players.length; i++) {
              if (players[i].isMerlin) return players[i];
            }
          })();

          ctx.user = assassin.user;
          ctx.controller.assassinateCallback(merlin.toJson());
          expect(ctx.user.socket.emit).to.have.been
            .calledWith('event', sinon.match.has('type', 'go:game_result'));
          expect(ctx.user.socket.emit).to.have.been
            .calledWith('event', sinon.match.has('type', 'evilWin'));
        });
      });
    });
  });
});
