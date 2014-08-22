var utils = require('../../utils')
  , GameCore = require('../core/game')
  , Quest = require('./quest');

var Game = module.exports = utils.inherit(GameCore, function Game(users) {
  var id = utils.randomId()
    , players = this.classMethods.assignJobs(users);

  this.superClass.call(this, id, players);
  this.bind();
});

utils.extend(Game.classMethods, {
  assignJobs: function(users){
    var joblist = this.Jobs[users.length.toString()].concat();

    // suffle jobs
    joblist.sort(function () { return Math.random() - Math.random(); });

    // assign jobs
    var players = [];
    for(var i = 0; i < users.length; i++){
      players.push(new joblist[i](users[i]));
    }

    // shuffle players
    players.sort(function () { return Math.random() - Math.random(); });
    return players;
  },
});

utils.extend(Game.prototype, {
  start: function () {
    this.nextQuest();
  },

  bind: function () {
    this.on('changeState:Assassin', this.onChangeAssassin.bind(this));
    this.on('changeState:EvilWin', this.evilWin.bind(this));
  },

  nextSelector: function () {
    this.selectorIdx = (this.selectorIdx || 0) % this.players.length;
    return this.currentSelector = this.players[this.selectorIdx++];
  },

  nextQuest: function () {
    var nextQuestIdx = this.quests.length
      , successCondition = this.successConditions[nextQuestIdx]
      , teamSize =  this.teamSize[nextQuestIdx]
      , quest = new Quest(this, successCondition, teamSize);

    this.quests.push(quest);
    this.emit('newQuest', quest);
    this.startCurrentQuest(quest);
    return quest;
  },

  startCurrentQuest: function (quest) {
    quest.on("success", this.onQuestResult.bind(this));
    quest.on("failure", this.onQuestResult.bind(this));
    quest.start();
  },

  assassinate: function (assassinPlayer, target) {
    if (!this.isAssassin())
      throw new Error('the game state isn\'t Assassin');
    if (this.findAssassin() !== assassinPlayer)
      throw new Error('the player isn\'t Assassin');

    if (target.isMerlin) {
      this.evilWin();
    } else {
      this.JusticeWin();
    }
  },

  onQuestResult: function () {
    this.checkStateChangeConditions();
    if (this.isQuest()) this.nextQuest();
  },

  onChangeAssassin: function () {
    this.emit("assassinPhase", this.findAssassin());
  },

  JusticeWin: function () {
    this.state = this.classMethods.States.JusticeWin;
    this.emit("justiceWin");
  },

  evilWin: function () {
    this.state = this.classMethods.States.EvilWin;
    this.emit("evilWin");
  },

  notifyAll: function (type, data) {
    this.players.forEach(function (player) {
      player.notify(type, data);
    });
  },
});

