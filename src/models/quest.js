var Team = require("./team")
  , utils = require("../utils")
  , events = require("events");

var Quest = function Quest(Game,success_number,team_sz, id){
  this.id = id ? id : utils.randomId();
  this.game = Game;
  this.success_number = success_number;
  this.teams = [];
  this.team_sz = team_sz;
  this.state = this.classMethods.States.Now;
  this.members = [];//User Array
  this.mission_list = {};//User.id -> Success/Failure(True/False) Hash
}

utils.inherit(events.EventEmitter, Quest);
Quest.classMethods.States = { Now: 'Now', Success: 'Success', Failure: 'Failure' }

Quest.prototype.isAllVoted = function () {
  return Object.keys(this.mission_list).length >= this.team_sz;
}

Quest.prototype.isSuccess = function () {
  return this.state === this.classMethods.States.Success;
}

Quest.prototype.isFailure = function () {
  return this.state === this.classMethods.States.Failure;
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
  var team = new Team(this.game, selector, this.team_sz, this.game.players.length);
  this.teams.push(team);
  this.vote_count += 1;
  this.emit('newTeam', team);
  team.on("agree",this.onAgree.bind(this,team));
  team.on("disAgree",this.onDisAgree.bind(this,team));
  return team;
}

Quest.prototype.judge_success = function(){
  if(!this.isAllVoted())
    throw 'Some players haven\'t vote yet.'

  if(this.successVotes() >= this.success_number){
    this.state = this.classMethods.States.Success;
    this.emit("success");
  }else{
    this.state = this.classMethods.States.Failure;
    this.emit("failure");
  }
}

Quest.prototype.change_mission_list = function(missioner,mission_res){
  if(!this.isContainMember(missioner))
    throw 'the player isn\'t team member';

  this.mission_list[missioner.id] = mission_res;
  this.emit('vote:Mission', missioner, mission_res);
  this.emit('update');
}

Quest.prototype.onAgree = function(team){
  this.game.emit('update');
  this.members = team.members;
}

Quest.prototype.onDisAgree = function(team){
  this.game.emit('update');
  if (this.teams.length == 5){
    return this.onAgree(team);
  }
  this.create_Team();
}

Quest.prototype.toJson = function (user) {
  var toJson = function (obj) { return obj.toJson(user); }
  return {
    id: this.id,
    success_number: this.success_number,
    team_sz: this.team_sz,
    teams: this.teams.map(toJson),
  };
}

utils.property(Quest.prototype, {
  team: {
    get: function () { return this.teams[this.teams.length - 1]; },
    set: function (team) {
      this.teams.push(team);
      this.emit("update");
      return team;
    }
  },
});

module.exports = Quest;
