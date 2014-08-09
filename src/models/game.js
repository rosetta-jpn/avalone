var Team = require("./quest")
  , events = require("events")
  , utils = require("../utils")
  , Quest = require('./quest')
  , Evil = require('./player/evil')
  , Justice = require('./player/justice')
  , Merlin = require('./player/merlin')
  , Mordred = require('./player/mordred')
  , Morgana = require('./player/morgana')
  , Oberon = require('./player/oberon')
  , Percival = require('./player/percival')
  , Assassin = require('./player/assassin');

var SuccessCondition = {5:[2,3,2,3,3],
                        6:[2,3,4,3,4],
                        7:[2,3,3,3,4],
                        8:[3,4,4,4,5],
                        9:[3,4,4,4,5],
                        10:[3,4,4,4,5]};


var TeamSize = {5:[2,3,2,3,3],
                6:[2,3,4,3,4],
                7:[2,3,3,4,4],
                8:[3,4,4,5,5],
                9:[3,4,4,5,5],
                10:[3,4,4,5,5]};

var Game = module.exports = function Game(players, id){
  this.id = id ? id : utils.randomId();
  this.players = players;
  this.buildPlayerMap();
  this.success_condition = SuccessCondition[players.length.toString()];
  this.team_sz = TeamSize[players.length.toString()];
  this.quests = [];
  this.state = this.classMethods.States.Quest;
}

utils.inherit(events.EventEmitter,Game);
Game.classMethods.States = {
  Quest: "Quest",
  EvilWin: "EvilWin",
  JusticeWin: "JusticeWin",
  Assassin: "Assassin",
};



Game.classMethods.Jobs = {5:[Justice,Justice,Merlin,  Evil,Assassin],
            6:[Justice,Justice,Merlin,Percival,   Mordred,Assassin],
            7:[Justice,Justice,Merlin,Percival,   Evil,Mordred,Assassin],
            8:[Justice,Justice,Justice,Merlin,Percival,   Evil,Mordred,Assassin],
            9:[Justice,Justice,Justice,Justice,Merlin,Percival,   Morgana,Mordred,Assassin],
            10:[Justice,Justice,Justice,Justice,Merlin,Percival,   Evil,Morgana,Mordred,Assassin]};





utils.extend(Game.classMethods, {
  assignJobs: function(users){
    var job_list = this.classMethods.Jobs[users.length.toString()].concat();
    // suffle jobs
    job_list.sort(function () { return Math.random() - Math.random(); });
    // assign jobs
    var players = [];
    for(var i = 0; i < users.length; i++){
      players.push(new job_list[i](users[i]));
    }
    // shuffle players
    players.sort(function () { return Math.random() - Math.random(); });
    return players;
  },

  assignAndCreate: function(users) {
    return new Game(this.assignJobs(users));
  },

});

Game.prototype.succeededQuestsCount = function () {
  var count = 0;
  for (var i = 0; i < this.quests.length; i++) {
    if (this.quests[i].isSuccess()) count++;
  }
  return count;
}

Game.prototype.failedQuestsCount = function () {
  var count = 0;
  for (var i = 0; i < this.quests.length; i++) {
    if (this.quests[i].isFailure()) count++;
  }
  return count;
}

Game.prototype.findAssassin = function () {
  for(var i = 0; i < this.players.length;i++){
    if(this.players[i].isAssassin){
      return this.players[i];
    }
  }
}

Game.prototype.start = function () {
  this.create_Quest();
}

Game.prototype.buildPlayerMap = function () {
  var playerMap = this.playerMap = {};
  this.players.forEach(function (player) {
    playerMap[player.id] = player;
  });
  return playerMap;
}

Game.prototype.nextSelector = function () {
  this.selectorIdx = (this.selectorIdx || 0) % this.players.length;
  return this.currentSelector = this.players[this.selectorIdx++];
}

Game.prototype.create_Quest = function(){
  var successCondition = this.success_condition[this.quests.length];
  var teamSize =  this.team_sz[this.quests.length];
  var quest = new Quest(this, successCondition, teamSize);
  this.quests.push(quest);
  this.currentQuest = quest;
  this.emit('newQuest', quest);
  this.startCurrentQuest(quest);
  return quest;
}

Game.prototype.startCurrentQuest = function (quest) {
  quest.on("success", this.onSuccess.bind(this));
  quest.on("failure", this.onFailure.bind(this));
  quest.start();
}

Game.prototype.assassinate = function(assassinPlayer, merlin_candidate){
  if (!this.isAssassin())
    throw 'the game state isn\'t Assassin';
  if (this.findAssassin() !== assassinPlayer)
    throw 'the player isn\'t Assassin';
  if(merlin_candidate.isMerlin){
    this.state = this.classMethods.States.EvilWin;
    this.emit("evilWin");
  }else{
    this.state = this.classMethods.States.JusticeWin;
    this.emit("justiceWin");
  }
}

Game.prototype.onSuccess = function(){
  if (this.succeededQuestsCount() >= 3) {
    this.state = this.classMethods.States.Assassin;
    this.emit("assassinPhase", this.findAssassin());
    this.emit('update');
  } else {
    this.create_Quest();
  }
}

Game.prototype.onFailure = function(){
  if(this.failedQuestsCount() >= 3){
    this.state = this.classMethods.States.EvilWin;
    this.emit("evilWin");
  } else {
    this.create_Quest();
  }
}

Game.prototype.notifyAll = function (type, data) {
  this.players.forEach(function (player) {
    player.notify(type, data);
  });
}

Game.prototype.toJson = function (user) {
  var toJson = function (obj) { return obj.toJson(user); }
  return {
    id: this.id,
    players: this.players.map(toJson),
    quests: this.quests.map(toJson),
    selectorIdx: (this.selectorIdx || 0),
  };
}

Game.prototype.isQuest = function(){
  return this.state === this.classMethods.States.Quest;
}

Game.prototype.isEvilWin = function(){
  return this.state === this.classMethods.States.EvilWin;
}

Game.prototype.isAssassin = function(){
  return this.state === this.classMethods.States.Assassin;
}

Game.prototype.isJusticeWin = function(){
  return this.state === this.classMethods.States.JusticeWin;
}

