var Game = require('../../models/game')
  , Base = require('./base')
//  , QuestReceiver = require('./quest_receiver');

var GameReceiver = module.exports = Base.extend({
  initialize: function (game) {
    this.game = game;

    this.client.on('new:Quest', this.onNewQuest.bind(this));
    this.client.on('update:Game', this.onUpdateGame.bind(this));
  },

  onUpdateGame: function (json) {
    this.game = this.updateGame(json.game, { users: this.room.users });
    this.game.emit('update:Game')
  },

  onNewQuest: function (json) {
    var quest = this.database.createQuest(json.quest)
    this.game.addQuest(quest);
 //   var questReceiver = new QuestReceiver(quest);
    this.game.once('new:Team', function () {
      questReceiver.stopListening();
    });
  },

  onReceiveTeam: function (json) {
    var team = Team.classMethods.fromCharCode(json.team);
    this.currentQuest.addTeam(team);
  },
});
