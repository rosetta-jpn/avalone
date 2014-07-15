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
    this.game.on('evilWin', this.onEvilWin.bind(this))
    this.game.on('justiceWin', this.onJusticeWin.bind(this))
  }, 

  onNewGame: function () {
    this.game.notifyAll('go:jobs');
  },

  onNewQuest: function (quest) {
    new QuestObserver(quest, this.game);
  },

  onAssassinPhase: function (player) {
    for (var id in this.room.users) {
      if (id === player.id) {
        // Assassin (select who is merlin)
        this.room.users[id].notify('go:AssassinVote');
      } else {
        // wait until Assassin selects
        this.room.users[id].notify('go:AssassinPhase');
      }
    }
  },

  onJusticeWin: function () {
    this.room.users[id].notify('go:game_result', { justiceWin: true, evilWin: false });
  },

  onEvilWin: function () {
    this.room.users[id].notify('go:game_result', { justiceWin: true, evilWin: false });
  },
});
