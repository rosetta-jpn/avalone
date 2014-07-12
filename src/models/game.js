var Team = require("./quest")
  , events = require("events");

Jobs = {5:[Justice,Justice,Merlin,  Evil,Assasin],
        6:[Justice,Justice,Merlin,Persival,   Modred,Assasin],
        7:[Justice,Justice,Merlin,Persival,   Evil,Modred,Assasin],
        8:[Justice,Justice,Justice,Merlin,Persival,   Evil,Modred,Assasin],
        9:[Justice,Justice,Justice,Merlin,Persival,   Morgana,Modred,Assasin],
       10:[Justice,Justice,Justice,Merlin,Persival,   Evil,Evil,Modred,Assasin]};

SuccessCondition = {5:[2,3,2,3,3],
                    6:[2,3,4,3,4],
                    7:[2,3,3,3,4],
                    8:[3,4,4,4,5],
                    9:[3,4,4,4,5],
                   10:[3,4,4,4,5]};


TeamSize = {5:[2,3,2,3,3],
            6:[2,3,4,3,4],
            7:[2,3,3,4,4],
            8:[3,4,4,5,5],
            9:[3,4,4,5,5],
           10:[3,4,4,5,5]};


function Game(users){
    this.players = this.define_jobs(users);
    this.quest_count = 0;
    this.success_condition = SuccessCondition[users.length.toString()];
    this.team_sz = TeamSize[users.length.toString()];
    this.quests = [];
    this.quest_success_count = 0;
    this.quest_failure_count = 0;
}

Game.prototype.define_jobs = function(users){
    var job_list = Jobs[users.length.toString()].concat();
    job_list.sort(function () { return Math.random() - Math.random(); });
    var players_ = [];
    for(var i = 0; i < users.length;i++){
        players_.push(job_list[i](users[i]));
    }
    return players_;
}

Game.prototype.create_Quest = function(){
    this.quests.push(new Quest(this,this.success_condition[quest_count],this.team_sz[quest_count]));
    this.quest_count += 1;
    this.team.on("success",this.onSuccess.bind(this));
    this.team.on("failure",this.onFailure,bind(this));
}

Game.prototype.Assasinate_success = function(merlin_candidate){
    if(merlin_candidate.is_Merlin()){
        this.emit("evilWin");
    }else{
        this.emit("justiceWin");
    }
}

Game.prototype.onSuccess = function(){
    this.quest_success_count += 1;
    if(this.quest_success_count >= 3){
        var assasin_index = 0;
        for(var i = 0; i < players.length;i++){
            if(players[i].is_Assasin()){
                assasin_index = i;
            }
        }
        this.emit("assasinPhase",players[assasin_index]);
        this.Assasinate_success();
    }
}

Game.prototype.onFailure = function(){
    this.quest_failure_count += 1;
    if(this.quest_failure_count >= 3){
        this.emit("evilWin");
    }
}

