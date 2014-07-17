var utils = require("../utils")
, events = require("events");

States = ["select_member", "vote", "agree","disagree"]

var Team = function Team(selector,group_sz,voter_sz){
  this.selector = selector;
  this.group = {};// User Array
  this.group_sz = group_sz;
  this.voter_map = {};//Teamr map User.id -> Yes/No(true/false)
  this.voter_sz = voter_sz;
  this.state = States[0];
}

utils.inherit(events.EventEmitter, Team);

Team.prototype.add_group = function(pusher,add_man) {
  // console.log(this.selector.toString(), pusher.toString());
  if (this.selector !== pusher)
    throw new Error('Only the selected player can add player to team');
  var group = Object.values(this.group)
  if(group.length >= this.group_sz)
    throw new Error('the team is full');

  this.group[add_man.id] = add_man;
}

Team.prototype.remove_group = function(remover,remove_man){
  if (this.selector !== remover)
    throw new Error('Only the selected player can remove player from team');
  var group = Object.values(this.group)
  if(group.length <= 0)
    throw new Error('the team is empty');
  delete this.group[remove_man.id];
}

Team.prototype.is_vote_success = function(){
  var agree = 0;
  var disagree = 0;
  if(Object.keys(this.voter_map).length != this.voter_sz){
    return false;
  }
  for(var pep in voter_map){
    if(voter_map[pep]){
      agree += 1;
    }else{
      disagree += 1;
    }
  }
  return agree > disagree;
}

Team.prototype.change_voter_map = function(voter,vote_res){
  
  this.voter_map[voter.id] = vote_res;
  this.emit('vote', voter, vote_res);

}

Team.prototype.go_vote = function(){
  if(this.state === States[0] && Object.values(this.group).length == this.group_sz){
    this.state = States[1];
    this.emit('go:vote');
  }
}

Team.prototype.judge = function(){
  if(this.state == States[1] && Object.keys(this.voter_map).length == this.voter_sz){
    if(this.is_vote_success()){
      this.state = States[2];
      this.emit("agree");
    }else{
      this.state = States[3];
      this.emit("disAgree");
    }
  }
}

Team.prototype.isApprove = function(){
  return this.state == States[2];// Approve
}



module.exports = Team;
