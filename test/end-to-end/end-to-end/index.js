var chai = require('chai')
  , sinon = require('sinon')

var expect = chai.expect;

require('../helpers/use_sinon_chai');

var Context = require('../../helpers/context')
  , helper = require('../helpers/shared')

var Requirements = require('../helpers/requirements');

describe('end to end', function () {
  var ctx;
  beforeEach(function () { ctx = new Context(); ctx.namespace('client', 'server'); });
  beforeEach(function () { ctx.clock = sinon.useFakeTimers(); });
  afterEach(function () { ctx.clock.restore(); });

  beforeEach(function () {
    helper.setupShared(ctx);
    helper.setupServer(ctx.server);
    helper.setupClients(ctx.client, ['a', 'b', 'c', 'd', 'e']);
    ctx.given({ owner: ctx.client.a, });
  });

  describe('connection', function () {
    it('client has id', function () {
      ctx.client.a.connect();
      expect(ctx.client.a.app.database.id).to.equal(ctx.client.a.userid);
    });
  });

  describe('login', function () {
    beforeEach(function () {
      ctx.client.a.connect();
    });

    it('client has currentRoom', function () {
      ctx.client.a.submit('enter', {
        user: { name: ctx.client.a.username },
        room: { name: ctx.roomname },
      });

      expect(ctx.client.a.app.database.currentRoom.name).to.equal(ctx.roomname);
    });
  });

  describe('game start', function () {
    context('enter all users', function () {
      beforeEach(function () {
        ctx.client.connectAll();
        helper.enterRoom(ctx.client.clients);
      });

      it('can start game', function () {
        var currentRoom = ctx.owner.app.database.currentRoom;
        expect(currentRoom.canStartGame()).to.be.true;
      });

      context('start game', function () {
        beforeEach(function () {
          ctx.owner.submit('gameStart');
        });

        it('clients have currentGame', function () {
          ctx.client.clients.forEach(function (client) {
            var router = client.app.router;
            expect(router.currentScene.name).to.equal('jobs');
            expect(client.app.database.currentGame).to.exist;
          });
        });

        it('change scene jobs', function () {
          ctx.client.clients.forEach(function (client) {
            var router = client.app.router;
            expect(router.currentScene.name).to.equal('jobs');
            expect(client.app.database.currentGame).to.exist;
          });
        });
      });
    });
  });

  describe('orgnize team', function () {
    beforeEach(function () {
      ctx.client.connectAll();
      helper.enterRoom(ctx.client.clients);
      ctx.owner.submit('gameStart');
      helper.changeScenes(ctx.client.clients, ['team']);
    });

    it('go to vote scene', function () {
      helper.orgnizeTeam(ctx.client.clients);
      ctx.client.clients.forEach(function (client) {
        var router = client.app.router;
        expect(router.currentScene.name).to.equal('vote');
      });
    });
  });

  describe('vote team', function () {
    beforeEach(function () {
      ctx.client.connectAll();
      helper.enterRoom(ctx.client.clients);
      ctx.owner.submit('gameStart');
      helper.changeScenes(ctx.client.clients, ['team']);
      helper.orgnizeTeam(ctx.client.clients);
    });

    it('go to vote_result scene', function () {
      helper.voteTeam(ctx.client.clients, true);
      ctx.client.clients.forEach(function (client) {
        var router = client.app.router
          , team = client.app.database.currentGame.currentQuest.teams[0];
        expect(router.currentScene.name).to.equal('vote_result');
        expect(team.vote.isApproved()).to.be.true;
        expect(team.isApprove()).to.be.true;
      });
    });
  });

  describe('mission', function () {
    beforeEach(function () {
      ctx.client.connectAll();
      helper.enterRoom(ctx.client.clients);
      ctx.owner.submit('gameStart');
      helper.changeScenes(ctx.client.clients, ['team']);
      helper.orgnizeTeam(ctx.client.clients);
      helper.voteTeam(ctx.client.clients, true);
      helper.changeScenes(ctx.client.clients, ['mission']);
    });

    it('go to mission_result scene', function () {
      helper.voteMission(ctx.client.clients, true);
      ctx.client.clients.forEach(function (client) {
        var router = client.app.router, quest = client.app.database.currentGame.quests[0];

        expect(router.currentScene.name).to.equal('mission_result');
        expect(client.app.database.currentGame.quests).to.have.length(2);
        if (quest.amIMember()) {
          expect(quest.vote.amIVoted()).to.be.true;
          expect(quest.vote.amIApproved()).to.be.true;
        }
        expect(quest.vote.isApproved()).to.be.true;
        expect(quest.isSuccess()).to.be.true;
      });
    });
  });
  
  context('assassinate non-merlin player', function () {
    beforeEach(function () {
      ctx.client.connectAll();
      helper.enterRoom(ctx.client.clients);
      ctx.owner.submit('gameStart');

      ctx.server.given('room', function () {
        return Object.values(ctx.server.avalon.rooms)[0];
      });

      // success three quests to go to assassin_phase.
      for (var i = 0; i < 3; i++) {
        helper.changeScenes(ctx.client.clients, ['team']);
        helper.orgnizeTeam(ctx.client.clients);
        helper.voteTeam(ctx.client.clients, true);
        helper.changeScenes(ctx.client.clients, ['mission']);
        helper.voteMission(ctx.client.clients, true);
      }
      helper.changeScenes(ctx.client.clients, ['assassin_phase']);
    });

    it('the currentGame\'s state is Assassin', function () {
      ctx.client.clients.forEach(function (client) {
        expect(client.app.database.currentGame.isAssassin()).to.be.true;
      });
    });

    it('reveal evils', function () {
      ctx.client.clients.forEach(function (client) {
        if (!client.app.database.playerProfile.isEvil) {
          var players = client.app.database.currentGame.players
            , evilPlayers = players.filter(function (player) { return player.isEvil; })
            , assassinPlayers = players.filter(function (player) { return player.isAssassin; });
          expect(evilPlayers).to.have.length(2);
          expect(assassinPlayers).to.have.length(1);
        }
      });
    });

    context('assassinate non-merlin player', function () {
      beforeEach(function () {
        helper.assassinateMyself(ctx.client.clients);
      });

      it('go to game_result scene', function () {
        ctx.client.clients.forEach(function (client) {
          var router = client.app.router;
          expect(router.currentScene.name).to.equal('game_result');
          expect(client.app.database.currentGame)
        });
      });
    });
  });
});
