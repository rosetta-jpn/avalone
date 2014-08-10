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
    this.listenNewQuest(quest);
    this.game.addNewQuest(quest);
  },

  listenNewQuest: function (quest) {
    var questReceiver = new QuestReceiver(quest);
    this.game.emit('new:Quest');
    this.game.once('new:Quest', function () {
      questReceiver.stopListening();
    });
    return questReceiver;
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

  resumeGame: function () {
    if (this.game.isQuest()) {
      var questReceiver = this.listenNewQuest(this.game.currentQuest);
      questReceiver.resumeQuest();
    } else if (this.game.isAssassin()) {
      this.router.changeScene('assassin_phase');
    } else if (this.game.isAnySideWin()) {
      this.router.changeScene('game_result');
    }
  },
});
