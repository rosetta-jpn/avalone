var Quest = require('../../models/quest')
  , database = require('../database')
  , utils = require('../../utils');

utils.extend(Quest.prototype, {
  applyResult: function (isSuccess, success, failure) {
    this.successCount = success;
    this.failureCount = failure;
    this.state = isSuccess ? this.classMethods.States.Success : this.classMethods.States.Failure;
    this.emit('update');

    if (this.isSuccess) this.emit("success");
    else this.emit("failure");
  },

  // overwrite the original create_Team method for client.
  create_Team: function () {
  },

  pastTeamLogs: function(){
    var pastTeams = [];
    for(var i = 0;i < this.teams.length;i++){
      if(this.teams[i].isApprove() || this.teams[i].isReject()){
        pastTeams.push({ team:this.teams[i], index:i+1 });
      }
    }
    return pastTeams;
  },
});

