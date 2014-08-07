var utils = require("../utils")
, events = require("events");

States = ["select_member", "vote", "agree","disagree"]

var Team = function Team(game, selector,group_sz,voter_sz, id){
  this.id = id ? id : utils.randomId();
  this.game = game;
  this.selector = selector;
  this.group = {};// User Array
  this.group_sz = group_sz;
  this.voter_map = {};//Teamr map User.id -> Yes/No(true/false)
  this.voter_sz = voter_sz;
  this.state = States[0];
}

utils.inherit(events.EventEmitter, Team);

Team.prototype.isContainMember = function (player) {
  return !!this.group[player.id];
}

Team.prototype.isFullMember = function () {
  var group = Object.values(this.group)
  return group.length >= this.group_sz;
}

Team.prototype.isApprovedBy = function (player) {
  return this.voter_map[player.id];
}

Team.prototype.isAllVoted = function (player) {
  return Object.keys(this.voter_map).length >= this.voter_sz;
}

Team.prototype.add_group = function(pusher,add_man) {
  // console.log(this.selector.toString(), pusher.toString());
  // if (this.selector !== pusher)
  //   throw new Error('Only the selected player can add player to team');
  if(this.isFullMember()) throw new Error('the team is full');

  this.group[add_man.id] = add_man;
  this._members = null;
  this.emit('add', add_man);
}

Team.prototype.remove_group = function(remover,remove_man){
  if (this.selector !== remover)
    throw new Error('Only the selected player can remove player from team');
  var group = Object.values(this.group)
  if(group.length <= 0)
    throw new Error('the team is empty');
  delete this.group[remove_man.id];
  this._members = null;
  this.emit('remove', remove_man);
}

Team.prototype.is_vote_success = function(){
  if(Object.keys(this.voter_map).length != this.voter_sz){
    return false;
  }

  var agree = 0;
  var disagree = 0;
  for(var pep in this.voter_map){
    if(this.voter_map[pep]){
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
  console.log('Update:', this, this.voter_map);
  this.emit('update')
}

Team.prototype.go_vote = function(){
  if (this.state !== States[0])
    throw 'The current state isn\'t `select member`.'
  if (Object.values(this.group).length < this.group_sz)
    throw 'Team members are too few.'

  this.state = States[1];
  this.emit('go:vote');
}

Team.prototype.judge = function(){
  // if (this.state !== States[1])
  //   throw 'The current state isn\'t `vote`.'
  if (Object.keys(this.voter_map).length < this.voter_sz)
    throw 'Some players haven\'t vote yet.'

  if(this.is_vote_success()){
    this.state = States[2];
    this.emit("agree");
    this.emit('update')
    return true;
  } else {
    this.state = States[3];
    this.emit("disAgree");
    this.emit('update')
    return false;
  }
}

Team.prototype.isApprove = function(){
  return this.state == States[2];// Approve
}

Team.prototype.toJson = function (user) {
  var toJson = function (obj) { return obj.toJson(user); }
  return {
    id: this.id,
    selector: toJson(this.selector),
    group: Object.values(this.group).map(toJson),
    group_sz: this.group_sz,
    voter_map: this.voter_map,
    voter_sz: this.voter_sz,
  };
}

utils.property(Team.prototype, {
  members: {
    get: function () {
      if (this._members) return this._members;
      return this._members = Object.values(this.group);
    },
    set: function (members) {
      this._members = null;
      this.group = {};
      for (var i = 0; i < members.length; i++)
        this.group[members[i].id] = members[i];
      this.emit('update');
      return members;
    },
  },
});

module.exports = Team;
