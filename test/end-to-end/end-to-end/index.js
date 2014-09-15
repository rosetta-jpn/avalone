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

  context('prepare 5 clients (A, B, C, D, E)', function () {
    beforeEach(function () {
      helper.setupShared(ctx);
      helper.setupServer(ctx.server);
      helper.setupClients(ctx.client, ['A', 'B', 'C', 'D', 'E']);
      ctx.given({ owner: ctx.client.A, });
    });

    afterEach(function () {
      helper.unbindPresenters(ctx.client);
    });

    context('connect A to server', function () {
      it('client has id', function () {
        ctx.client.A.connect();
        expect(ctx.client.A.app.database.id).to.equal(ctx.client.A.userid);
      });
    });

    context('login A', function () {
      context('A enters', function () {
        beforeEach(function () {
          ctx.client.A.connect();
        });

        it('A has currentRoom', function () {
          ctx.client.A.submit('enter', {
            user: { name: ctx.client.A.username },
            room: { name: ctx.roomname },
          });

          expect(ctx.client.A.app.database.currentRoom.name).to.equal(ctx.roomname);
        });
      });

      context('B logins after A enters a room', function () {
        beforeEach(function () {
          ctx.client.A.connect();
          ctx.client.A.submit('enter', {
            user: { name: ctx.client.A.username },
            room: { name: ctx.roomname },
          });
          ctx.client.B.connect();
        });

        it('B knows the room', function () {
          var room = ctx.client.B.app.database.findRoom(ctx.roomname);
          expect(room).to.exist;
          expect(room.name).to.be.equal(ctx.roomname);
          expect(room.users).to.have.length(1);
          expect(room.users[0].id).to.be.equal(ctx.client.A.userid);
        })

        context('login another user', function () {
          beforeEach('enter the second user', function () {
            ctx.client.B.submit('enter', {
              user: { name: ctx.client.B.username },
              room: { name: ctx.roomname },
            });

            ctx.client.C.connect();
          });

          it('the latest user know the room', function () {
            var room = ctx.client.C.app.database.findRoom(ctx.roomname);
            expect(room).to.exist;
            expect(room.name).to.be.equal(ctx.roomname);
            expect(room.users).to.have.length(2);
            expect(room.users[0].id).to.be.equal(ctx.client.A.userid);
            expect(room.users[1].id).to.be.equal(ctx.client.B.userid);
          })
        });
      });
    });

    context('disconnect a User in game', function () {
      beforeEach(function () {
        ctx.client.connectAll();
        ctx.client.clients.forEach(helper.enterRoom);
      });

      it('the user disconnected is disappeared', function () {
        ctx.client.E.disconnect();

        var userE = ctx.client.A.app.database.findUser(ctx.client.E.app.database.id);
        expect(userE).to.not.exist;
      });

      context('disconnect after game start', function () {
        beforeEach(function () {
          ctx.owner.submit('gameStart');
        });

        it('other users know that the user disconnected', function () {
          ctx.client.E.disconnect();

          var userE = ctx.client.A.app.database.findUser(ctx.client.E.app.database.id);
          expect(userE.isDisconnected).to.be.true;
        });
      });

    });

    describe('all clients enter room', function () {
      context('enter two user', function () {
        beforeEach(function () {
          ctx.client.connectAll();
          ctx.given({
            clientsInRoom: ctx.client.clients.slice(0, 2),
            otherClients: ctx.client.clients.slice(2),
          });
          ctx.clientsInRoom.forEach(helper.enterRoom);
        });

        it('users in room have currentRoom', function () {
          ctx.clientsInRoom.forEach(function (client) {
            var currentRoom = client.app.database.currentRoom
            expect(currentRoom).to.exist;
            expect(currentRoom.name).to.be.equal(ctx.roomname);
            expect(currentRoom.users).to.have.length(ctx.clientsInRoom.length);
          });
        });

        it('other users don\'t have currentRoom', function () {
          ctx.otherClients.forEach(function (client) {
            expect(client.app.database.currentRoom).not.to.exist;
          });
        });

        it('other users know the room', function () {
          ctx.otherClients.forEach(function (client) {
            var room = client.app.database.findRoom(ctx.roomname);
            expect(room).to.exist;
            expect(room.name).to.be.equal(ctx.roomname);
            expect(room.users).to.have.length(ctx.clientsInRoom.length);
          });
        });

      });
    });

    describe('game start', function () {
      context('enter all users', function () {
        beforeEach(function () {
          ctx.client.connectAll();
          ctx.client.clients.forEach(helper.enterRoom);
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
        ctx.client.clients.forEach(helper.enterRoom);
        ctx.owner.submit('gameStart');
        ctx.client.clients.forEach(function (client) {
          helper.changeScenes(client, ['team']);
          helper.orgnizeTeam(client);
        });
      });

      it('go to vote scene', function () {
        ctx.client.clients.forEach(function (client) {
          var router = client.app.router;
          expect(router.currentScene.name).to.equal('vote');
        });
      });
    });

    describe('vote team', function () {
      beforeEach(function () {
        ctx.client.connectAll();
        ctx.client.clients.forEach(helper.enterRoom);
        ctx.owner.submit('gameStart');
        ctx.client.clients.forEach(function (client) {
          helper.changeScenes(client, ['team']);
          helper.orgnizeTeam(client);
        });
      });

      it('go to vote_result scene', function () {
        ctx.client.clients.forEach(function (client) {
          var team = client.app.database.currentTeam;
          helper.voteTeam(client, true);
          expect(team.vote.amIVoted()).to.be.true;
          expect(team.vote.amIApproved()).to.be.true;
        });

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
        ctx.client.clients.forEach(helper.enterRoom);
        ctx.owner.submit('gameStart');
        ctx.client.clients.forEach(function (client) {
          helper.changeScenes(client, ['team']);
          helper.orgnizeTeam(client);
        });
        ctx.client.clients.forEach(function (client) {
          helper.voteTeam(client, true);
          helper.changeScenes(client, ['mission']);
        });
      });

      context('success mission', function () {
        it('go to mission_result scene', function () {
          ctx.client.clients.forEach(function (client) {
            var quest = client.app.database.currentQuest;
            helper.voteMission(client, true);
            if (quest.amIMember()) {
              expect(quest.vote.amIVoted()).to.be.true;
              expect(quest.vote.amIApproved()).to.be.true;
            }
          });

          ctx.client.clients.forEach(function (client) {
            var router = client.app.router, quest = client.app.database.currentGame.quests[0];

            expect(router.currentScene.name).to.equal('mission_result');
            expect(client.app.database.currentGame.quests).to.have.length(2);

            expect(quest.vote.isApproved()).to.be.true;
            expect(quest.isSuccess()).to.be.true;
          });
        });
      });

      context('fail mission', function () {
        it('the latest mission is failed', function () {
          ctx.client.clients.forEach(function (client) {
            var quest = client.app.database.currentQuest;
            helper.voteMission(client, false);
            if (quest.amIMember()) {
              expect(quest.vote.amIVoted()).to.be.true;
              expect(quest.vote.amIApproved()).to.be.false;
            }
          });

          ctx.client.clients.forEach(function (client) {
            var router = client.app.router, quest = client.app.database.currentGame.quests[0];

            expect(router.currentScene.name).to.equal('mission_result');
            expect(client.app.database.currentGame.quests).to.have.length(2);

            expect(quest.vote.isApproved()).to.be.false;
            expect(quest.isSuccess()).to.be.false;
          });
        });
      });
    });

    context('assassinate non-merlin player', function () {
      beforeEach(function () {
        ctx.client.connectAll();
        ctx.client.clients.forEach(helper.enterRoom);
        ctx.owner.submit('gameStart');

        ctx.server.given('room', function () {
          return Object.values(ctx.server.avalon.rooms)[0];
        });

        // success three quests to go to assassin_phase.
        for (var i = 0; i < 3; i++) {
          ctx.client.clients.forEach(function (client) {
            helper.changeScenes(client, ['team']);
            helper.orgnizeTeam(client);
          });
          ctx.client.clients.forEach(function (client) {
            helper.voteTeam(client, true);
          });
          ctx.client.clients.forEach(function (client) {
            helper.changeScenes(client, ['mission']);
            helper.voteMission(client, true);
          });
        }
        ctx.client.clients.forEach(function (client) {
          helper.changeScenes(client, ['mission']);
          helper.voteMission(client, true);
        });
        ctx.client.clients.forEach(function (client) { helper.changeScenes(client, ['assassin_phase']); });
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
          ctx.client.clients.forEach(helper.assassinateMyself);
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
});
