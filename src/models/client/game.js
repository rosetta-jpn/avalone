var utils = require('../../utils')
  , GameCore = require('../core/game')
  , PlayerSelection = require('./player_selection');

var Game = module.exports =
  utils.inherit(GameCore, function Game(database, state, selectorIdx) {
  var args = Array.prototype.slice.call(arguments, 3);
  this.superClass.apply(this, args);
  this.database = database;
  this.state = state;
  this.selectorIdx = selectorIdx;
});

utils.extend(Game.classMethods, {
  parseJson: function (json, database, options) {
    var players = json.players.map(function (obj) { return database.parsePlayer(obj, options); })
      , state = json.state
      , selectorIdx = json.selectorIdx;
    var game = new Game(database, state, selectorIdx, json.id, players);

    options = utils.merge(options, { parentGame: game })
    game.quests = (json.quests || []).map(function (obj) {
      return database.parseQuest(obj, options);
    });
    return game;
  },
});

utils.extend(Game.prototype, {
  addQuest: function (quest) {
    this.superProto.addQuest.call(this, quest);
    quest.on('success', this.onQuestResult.bind(this));
    quest.on('failure', this.onQuestResult.bind(this));
  },

  onQuestResult: function () {
    this.checkStateChangeConditions();
  },

  /* helper methods */

  canAssassinate: function () {
    var assassin = this.findAssassin();
    return assassin && assassin.id === this.database.id;
  },

  jobList : function() {
    return this.classMethods.Jobs[this.players.length];
  },

  assassinateSelection: function () {
    function read(player) {
      return this.isTarget(player);
    }

    function publish(player, value) {
      value ? this.selectTarget(player) : this.unselectTarget(player);
      this.emit('change:Game.assassinateSelection');
    }

    return new PlayerSelection(this.players, 1, read.bind(this), publish.bind(this));
  },

  assassinateCandidates: function () {
    return this.assassinateSelection().candidates;
  },

  isTarget: function (player) {
    return this.target && this.target.isSame(player);
  },

  selectTarget: function (player) {
    this.target = player;
  },

  unselectTarget: function (player) {
    if (this.isTarget(player)) this.target = null;
  },

  pastQuestLogs: function() {
    var pastQuests = [];
    for (var i = 0; i < this.quests.length; i++) {
      var pastTeamsOfQuest = this.quests[i].pastTeamLogs();
      pastQuests.push({ quest: this.quests[i], index: i + 1 });
    }
    return pastQuests;
  },
});

