var utils = require('../../utils')
  , PlayerModule = require('./player')
  , events = require('events');

var Evil = PlayerModule.Evil
  , Justice = PlayerModule.Justice
  , Merlin = PlayerModule.Merlin
  , Mordred = PlayerModule.Mordred
  , Morgana = PlayerModule.Morgana
  , Oberon = PlayerModule.Oberon
  , Percival = PlayerModule.Percival
  , Assassin = PlayerModule.Assassin;

module.exports = Game;
function Game(id, players) {
  this.id = id;
  this.players = players;
  this.state = this.classMethods.States.Quest;
  this.quests = [];
  this.successConditions =
    this.classMethods.SuccessConditionTable[this.players.length];
  this.teamSize =
    this.classMethods.TeamSizeTable[this.players.length];
}

utils.inherit(events.EventEmitter, Game);
utils.extend(Game.classMethods, {
  States: {
    Quest: "Quest",
    EvilWin: "EvilWin",
    JusticeWin: "JusticeWin",
    Assassin: "Assassin",
  },

  Jobs: {
    5:  [Justice, Justice, Merlin, Evil, Assassin],
    6:  [Justice, Justice, Merlin, Percival, Mordred, Assassin],
    7:  [Justice, Justice, Merlin, Percival, Evil, Mordred, Assassin],
    8:  [Justice, Justice, Justice, Merlin, Percival, Evil, Mordred, Assassin],
    9:  [Justice, Justice, Justice, Justice, Merlin, Percival, Morgana, Mordred, Assassin],
    10: [Justice, Justice, Justice, Justice, Merlin, Percival, Evil, Morgana, Mordred, Assassin],
  },

  SuccessConditionTable: {
    5:  [2, 3, 2, 3, 3],
    6:  [2, 3, 4, 3, 4],
    7:  [2, 3, 3, 3, 4],
    8:  [3, 4, 4, 4, 5],
    9:  [3, 4, 4, 4, 5],
    10: [3, 4, 4, 4, 5],
  },

  TeamSizeTable: {
    5:  [2, 3, 2, 3, 3],
    6:  [2, 3, 4, 3, 4],
    7:  [2, 3, 3, 4, 4],
    8:  [3, 4, 4, 5, 5],
    9:  [3, 4, 4, 5, 5],
    10: [3, 4, 4, 5, 5],
  },
});

utils.extend(Game.prototype, {
  addQuest: function (quest) {
    this.quests.push(quest);
  },

  succeededQuestsCount: function () {
    var count = 0;
    for (var i = 0; i < this.quests.length; i++) {
      if (this.quests[i].isSuccess()) count++;
    }
    return count;
  },

  failedQuestsCount: function () {
    var count = 0;
    for (var i = 0; i < this.quests.length; i++) {
      if (this.quests[i].isFailure()) count++;
    }
    return count;
  },

  findAssassin: function () {
    for(var i = 0; i < this.players.length;i++){
      if(this.players[i].isAssassin){
        return this.players[i];
      }
    }
  },

  checkStateChangeConditions: function () {
    if (this.isQuest) {
      if (this.succeededQuestsCount() >= 3) {
        this.state = this.classMethods.States.Assassin;
        this.emit('changeState:Assassin');
      } else if (this.failedQuestsCount() >= 3) {
        this.state = this.classMethods.States.EvilWin;
        this.emit('changeState:EvilWin');
      }
    }
  },

  findPlayer: function (id) {
    return this.playerMap[id];
  },

  toJson: function (user, options) {
    if (this.isAssassin()) options = utils.merge({ revealEvils: true }, options)
    if (this.isAnySideWin()) options = utils.merge({ revealPlayers: true }, options)
    var toJson = function (obj) { return obj.toJson(user, options); }
    return {
      id: this.id,
      players: this.players.map(toJson),
      quests: this.quests.map(toJson),
      state: this.state,
      selectorIdx: (this.selectorIdx || 0),
    };
  },

  isQuest: function(){
    return this.state === this.classMethods.States.Quest;
  },

  isEvilWin: function(){
    return this.state === this.classMethods.States.EvilWin;
  },

  isAssassin: function(){
    return this.state === this.classMethods.States.Assassin;
  },

  isJusticeWin: function(){
    return this.state === this.classMethods.States.JusticeWin;
  },

  isAnySideWin: function(){
    return this.isJusticeWin() || this.isEvilWin();
  },
});

utils.property(Game.prototype, {
  playerMap: {
    get: function () {
      if (this._playerMap) return this._playerMap;
      var playerMap = this._playerMap = {};
      this.players.forEach(function (player) {
        playerMap[player.id] = player;
      });
      return playerMap;
    },
  },

  currentQuest: {
    get: function () { return this.quests[this.quests.length - 1]; },
  },
});

