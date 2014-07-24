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


var Jobs = {5:[Justice,Justice,Merlin,  Evil,Assassin],
            6:[Justice,Justice,Merlin,Percival,   Mordred,Assassin],
            7:[Justice,Justice,Merlin,Percival,   Evil,Mordred,Assassin],
            8:[Justice,Justice,Justice,Merlin,Percival,   Evil,Mordred,Assassin],
            9:[Justice,Justice,Justice,Merlin,Percival,   Oberon,Mordred,Assassin],
            10:[Justice,Justice,Justice,Merlin,Percival,   Evil,Oberon,Mordred,Assassin]};

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

var States = ["quest","evilWin","justiceWin","assassin"];


var Game = module.exports = function Game(players){
  this.players = players;
  this.buildPlayerMap();
  this.success_condition = SuccessCondition[players.length.toString()];
  this.team_sz = TeamSize[players.length.toString()];
  this.quests = [];
  this.quest_success_count = 0;
  this.quest_failure_count = 0;
  this.state = "quest"
}

utils.inherit(events.EventEmitter,Game);

utils.extend(Game.classMethods, {
  assignJobs: function(users){
    var job_list = Jobs[users.length.toString()].concat();
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
  quest.on("success", this.onSuccess.bind(this));
  quest.on("failure", this.onFailure.bind(this));
  quest.start();
  return quest;
}

Game.prototype.Assassinate_success = function(merlin_candidate){
  if(merlin_candidate.is_Merlin()){
    this.state = "evilWin";
    this.emit("evilWin");
  }else{
    this.state = "justiceWin";
    this.emit("justiceWin");
  }
}

Game.prototype.onSuccess = function(){
  this.quest_success_count += 1;
  if(this.quest_success_count >= 3){
    var assassin_index = 0;
    for(var i = 0; i < players.length;i++){
      if(players[i].isAssassin){
        assassin_index = i;
      }
    }
    this.state = "assassin";
    this.emit("assassinPhase",players[assassin_index]);
    this.Assassinate_success();
  }
}

Game.prototype.onFailure = function(){
  this.quest_failure_count += 1;
  if(this.quest_failure_count >= 3){
    this.state = "evilWin";
    this.emit("evilWin");
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
    players: this.players.map(toJson),
    quests: this.quests.map(toJson),
    selectorIdx: (this.selectorIdx || 0),
  };

Game.prototype.isQuest = function(){
  return this.state == "quest";
}

Game.prototype.isEvilWin = function(){
  return this.state == "evilWin";
}

Game.prototype.isAssassin = function(){
  return this.state = "assassin";
}

Game.prototype.isJusticeWin = function(){
  return this.state = "justiceWin";
}

