var utils = require("../utils")
  , events = require("events");

States = ["select_member", "vote", "agree","disagree"]

var Team = function Team(selector,group_sz,voter_sz){
    this.selector = selector;
    this.group = [];// User Array
    this.group_sz = group_sz;
    this.voter_map = {};//Teamr map User.id -> Yes/No(true/false)
    this.voter_sz = voter_sz;
    this.state = States[0];
}

utils.inherit(events.EventEmitter, Team);

Team.prototype.add_group = function(pusher,add_man) {
    if(this.selector === pusher && this.group.length < group_sz){
        var add_man_in_group = false;
        for(var i = 0; i < group.length;i++){
            if(this.group[i] === add_man){
                add_man_in_group = true;
            }
        }
        if(!add_man_in_group){
            this.group.push(add_man);
        }
    }
}

Team.prototype.remove_group = function(remover,remove_man){
    if(this.selector === remover && this.group.length > 0){
        var remove_man_index = -1;
        for(var i = 0; i < group.length;i++){
            if(this.group[i] === remove_man){
                remove_man_index = i;
            }
        }
        if(remove_man_index > 0){
            this.group = this.group.splice(remove_man_index,1);
        }
    }
}

Team.prototype.is_vote_success = function(){
    var agree = 0;
    var disagree = 0;
    if(Object.keys(this.voter_map).length != voter_sz){
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
    
    voter_map[voter.id] = vote_res;

}

Team.prototype.go_vote = function(){
    if(this.state === States[0] && this.group.length == this.group_sz){
        this.state = States[1];
    }
}

Team.prototype.judge = function(){
    if(this.state == States[1] && Object.keys(this.voter_map).length == voter_sz){
        if(this.is_vote_success()){
            this.state = States[2];
            this.emit("agree");
        }else{
            this.state = States[3];
            this.emit("disAgree");
        }
    }
}



module.exports = Team;
