var Team = require("./team")
  , utils = require("../utils")
  , events = require("events");

var States = ["NOW","SUCCESS","FAILURE"]

var Quest = function Quest(Game,success_number,team_sz){
  this.game = Game;
  this.success_number = success_number;
  this.team_sz = team_sz;
  this.result = "NOW";
  this.vote_count = 0;
  this.members = [];//User Array
  this.mission_list = {};//User.id -> Success/Failure(True/False) Hash
}

utils.inherit(events.EventEmitter, Quest);

Quest.prototype.isAllVoted = function () {
  return Object.keys(this.mission_list).length >= this.team_sz;
}

Quest.prototype.isSuccess = function () {
  return this.state === States[1];
}

Quest.prototype.isFailure = function () {
  return this.state === States[2];
}

Quest.prototype.successVotes = function () {
  var success = 0;
  for(var pep in this.mission_list){
    if(this.mission_list[pep]){
      success += 1;
    }
  }
  return success;
}

Quest.prototype.failureVotes = function () {
  var failure = 0;
  for(var pep in this.mission_list){
    if(!this.mission_list[pep]){
      failure += 1;
    }
  }
  return failure;
}

Quest.prototype.isContainMember = function (player) {
  for(var i = 0; i < this.members.length; i++) {
    if(this.members[i] === player) return true;
  }
  return false;
}

Quest.prototype.start = function () {
  this.create_Team();
}

Quest.prototype.create_Team = function(){
  var selector = this.game.nextSelector();
  this.team = new Team(selector, this.team_sz, this.game.players.length);
  this.vote_count += 1;
  this.emit('newTeam', this.team);
  this.team.on("agree",this.onAgree.bind(this));
  this.team.on("disAgree",this.onDisAgree.bind(this));
  return this.team;
}

Quest.prototype.judge_success = function(){
  if(!this.isAllVoted())
    throw 'Some players haven\'t vote yet.'

  if(this.successVotes() >= this.success_number){
    this.state = "SUCCESS";
    this.emit("success");
  }else{
    this.state = "FAILURE"
    this.emit("failure");
  }
}

Quest.prototype.change_mission_list = function(missioner,mission_res){
  if(!this.isContainMember(missioner))
    throw 'the player isn\'t team member';

  this.mission_list[missioner.id] = mission_res;
  this.emit('voteMission', missioner, mission_res);
  this.emit('update');
}

Quest.prototype.onAgree = function(){
  this.members = this.team.members;
}

Quest.prototype.onDisAgree = function(){
  if(vote_count == 5){
    return this.onAgree();
  }
  this.create_Team();
}

Quest.prototype.toJson = function (user) {
  var toJson = function (obj) { return obj.toJson(user); }
  return {
    success_number: this.success_number,
    team: team ? toJson(this.team) : null,
  };
}

module.exports = Quest;
