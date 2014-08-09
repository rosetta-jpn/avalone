var utils = require('../utils')
  , QuestObserver = require('./quest_observer');
;

var GameObserver = module.exports = function GameObserver(game, room) {
  this.game = game;
  this.room = room;
  this.bind();
  this.onNewGame();
}

utils.extend(GameObserver.prototype, {
  bind: function () {
    this.game.on('newQuest', this.onNewQuest.bind(this))
    this.game.on('assassinPhase', this.onAssassinPhase.bind(this))
    this.game.on('evilWin', this.onEvilWin.bind(this))
    this.game.on('justiceWin', this.onJusticeWin.bind(this))
  },

  onNewGame: function () {
    this.game.notifyAll('go:jobs');
    var game = this.game;
    this.game.players.forEach(function (looker) {
      looker.notify('new:Game', { game: game.toJson(looker) });
    });
  },

  onNewQuest: function (quest) {
    new QuestObserver(quest, this.game);
  },

  onAssassinPhase: function (assassin) {
    var self = this;
    this.game.players.forEach(function (player) {
      if (player.id === assassin.id) {
        // Assassin (select who is merlin)
        player.notify('go:AssassinVote');
      } else {
        // wait until Assassin selects
        player.notify('go:AssassinPhase');
      }
      player.notify('revealEvils:Game',
                    self.game.toJson(player, { revealEvils: true }));
    });
  },

  onJusticeWin: function () {
    this.room.notifyAll('justiceWin');
    this.room.notifyAll('go:game_result');
    this.room.notifyAll('revealPlayers:Game', this.game.toJson());
  },

  onEvilWin: function () {
    this.room.notifyAll('evilWin');
    this.room.notifyAll('go:game_result');
    this.room.notifyAll('revealPlayers:Game', this.game.toJson());
  },
});
