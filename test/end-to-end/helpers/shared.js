var Requirements = require('./requirements')
  , IOHelper = require('../../helpers/io_helper')
  , ServerMock = require('./server_mock')
  , SocketMock = require('./socket_mock')
  , connect = require('../helpers/connect');

var ClientApp = Requirements.Client.App
  , User = Requirements.Core.User
  , Avalon = Requirements.Server.Models.Avalon
  , Controller = Requirements.Server.Server.Controller
  , Config = Requirements.Server.Server.Config;

module.exports = {
  setupClients: function (ctx, namespaces) {
    namespaces = namespaces || ['a', 'b', 'c', 'd', 'e'];
    ctx.namespace.apply(ctx, namespaces);

    namespaces.forEach(function (name) {
      ctx[name].given({
        root: (ctx.parent || ctx),
        app: function () { return new ClientApp(this.client, this.io, { changeLocation: false }); },
        io: function () { return this.ioHelper.createBoot(); },
        ioHelper: function () { return new IOHelper(this.root.clock); },
        username: 'User-' + name,
        userid: 'UserId-' + name,
        socketOptions: function () { return { id: this.userid }; },
        submit: function () { return this.app.client.submit.bind(this.app.client); },
      });

      ctx[name].connect = function () {
        this.app.boot();
        connect(this.ioHelper, this.root.server.serverMock, this.socketOptions);
      };
    });

    ctx.namespaces = namespaces;
    ctx.clients = namespaces.map(function (name) { return ctx[name]; });
    ctx.connectAll = function () {
      this.clients.forEach(function (ctx) {
        ctx.connect();
      });
    };
  },

  unbindPresenters: function (ctx) {
    ctx.clients.forEach(function (client) {
      if (client.app.router)
        client.app.router.unbindPresenters();
    });
  },

  setupServer: function (ctx) {
    ctx.given({
      serverMock: function () {
        return new ServerMock(this.avalon, Controller, this.config);
      },
      config: function () { return new Config({env: 'test'}); },
      avalon: function () { return new Avalon(); },
    });
  },

  setupShared: function (ctx) {
    ctx.given({
      id: 'testUser',
      username: 'hoge',
      roomname: 'testRoom',
    });
  },

  enterRoom: function (clients) {
    clients.forEach(function (ctx) {
      ctx.submit('enter', {
        user: { name: ctx.username },
        room: { name: ctx.root.roomname },
      });
    });
  },

  changeScenes: function (clients, scenes) {
    clients.forEach(function (client) {
      scenes.forEach(function (scene) {
        client.app.router.changeScene(scene);
      });
    });
  },

  orgnizeTeam: function (clients) {
    clients.forEach(function (client) {
      var game = client.app.database.currentGame;
      var team = client.app.database.currentTeam;
      if (team.amITeamSelector()) {
        var selection = team.memberSelection();
        var player = client.app.database.playerProfile;
        for (var i = 0; i < selection.selectionSize; i++)
          selection.publish(game.players[i], true);

        client.submit('orgTeam', team.toJson());
      }
    });
  },

  voteTeam: function (clients, isApprove, aroundAction) {
    clients.forEach(function (client) {
      aroundAction ? aroundAction(client, cont) : cont();
      function cont () {
        var game = client.app.database.currentGame;
        var team = client.app.database.currentTeam;
        team.vote.vote(client.app.database.playerProfile, isApprove);
        client.submit(isApprove ? 'approveTeam' : 'rejectTeam', team.toJson());
      }
    });
  },

  voteMission: function (clients, isSuccess, aroundAction) {
    clients.forEach(function (client) {
      aroundAction ? aroundAction(client, cont) : cont();
      function cont () {
        var quest = client.app.database.currentQuest;
        if (quest.amIMember()) {
          quest.vote.vote(client.app.database.playerProfile, isSuccess);
          client.submit(isSuccess ? 'successQuest' : 'failQuest', quest.toJson());
        }
      }
    });
  },

  assassinateMyself: function (clients) {
    clients.forEach(function (client) {
      var game = client.app.database.currentGame;
      if (game.canAssassinate()) {
        client.submit('assassinate', client.app.database.playerProfile.toJson());
      }
    });
  },
};
