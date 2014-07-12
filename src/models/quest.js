var Team = require("./team")
  , event = require("events");

function Quest(Game,success_count,team_sz){
    this.game = Game;
    this.success_count = success_count;
    this.team_sz = team_sz;
    this.vote_count = 0;
    this.members = [];//User Array
    this.mission_list = {};//User.id -> Success/Failure(True/False) Hash
}


Quest.prototype.create_Team = function(){
    this.team = new Team(this.game.next_selector(),team_sz,this.game.players.length());
    this.vote_count += 1;
    this.team.on("agree",this.onAgree.bind(this));
    this.team.on("disAgree",this.onDisAgree.bind(this));
}

Quest.prototype.judge_success = function(){
    var success = 0;
    if(Object.keys(this.members).length == team_sz){
        for(var pep in mission_list){
            if(mission_list[pep]){
                success += 1;
            }
        }
        if(success >= success_count){
            return true;
        }
    }
    return false;
}

Quest.prototype.change_mission_list = function(missioner,mission_res){
    var in_team_group = false;
    for(var i = 0;i < this.members.length;i++){
        if(this.members[i] === missioner){
            in_team_group = true;
        }
    }
    if(in_team_group){
        mission_list[missioner.id] = mission_res;
    }
}



Quest.prototype.onAgree = function(){
    this.members = this.team.group;
}

Quest.prototype.onDisAgree = function(){
    if(vote_count == 5){
        return this.onAgree();
    }
    this.create_Team();
}

module.exports = Quest;
