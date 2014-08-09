var Game = require('../../models/game')
  , Base = require('./base')
  , QuestReceiver = require('./quest_receiver');

var GameReceiver = module.exports = Base.extend({
  initialize: function (game) {
    this.game = game;

    this.listen(this.client, 'new:Quest', this.onNewQuest.bind(this));
    this.listen(this.client, 'update:Game', this.onUpdateGame.bind(this));
    this.listen(this.client, 'update:Game', this.onUpdateGame.bind(this));
    this.listen(this.client, 'revealEvils:Game', this.onRevealPlayers.bind(this));
    this.listen(this.client, 'revealPlayers:Game', this.onRevealPlayers.bind(this));
    this.listen(this.client, 'justiceWin', this.onJusticeWin.bind(this));
    this.listen(this.client, 'evilWin', this.onEvilWin.bind(this));
  },

  onUpdateGame: function (json) {
    this.game = this.updateGame(json.game, { users: this.room.users });
    this.game.emit('update:Game')
  },

  onNewQuest: function (json) {
    var quest = this.database.createQuest(json.quest)
    var questReceiver = new QuestReceiver(quest);
    this.game.addNewQuest(quest);
    this.game.emit('new:Team');
    this.game.once('new:Team', function () {
      questReceiver.stopListening();
    });
  },

  onReceiveTeam: function (json) {
    var team = Team.classMethods.fromCharCode(json.team);
    this.currentQuest.addTeam(team);
  },

  onRevealPlayers: function (json) {
    for (var i = 0; i < json.players.length; i++)
      this.database.updatePersona(json.players[i]);
  },

  onJusticeWin: function () {
    this.game.state = this.game.classMethods.States.JusticeWin;
    this.game.emit('update')
  },
  
  onEvilWin: function () {
    this.game.state = this.game.classMethods.States.EvilWin;
    this.game.emit('update')
  },
});
