(function (Scene) {
  Scene.StartScene = Scene.extend({
    selector: '#start',

    bind: function () {
      $('form#enterRoom').on('submit', this.onSubmitRoom.bind(this));
      this.client.on('go:lobby', this.goLobby.bind(this))
    },

    onSubmitRoom: function (e) {
      e.preventDefault();
      this.client.submit('enter', $(e.target).formData());
    },

    goLobby: function () {
      if (this.page.isCurrentScene(this))
        this.page.changeScene('lobby');
    },
  });

  Scene.LobbyScene = Scene.extend({
    selector: '#lobby',
    users: {},

    bind: function () {
      this.$el.find('a#start-game').on('click', this.onSubmitStartGame.bind(this));
      this.client.on('go:jobs',this.goJobs.bind(this));
    },

    onSubmitStartGame: function (e) {
      e.preventDefault();
      this.client.submit('gameStart');
    },

    goJobs: function () {
      if(this.page.isCurrentScene(this)){
        this.page.changeScene('jobs');
      }
    },
  });
  
  Scene.JobsScene = Scene.extend({
    selector: '#jobs',

    bind: function() {
      this.$el.find('#go_team').on('click',this.goTeam.bind(this));
    },
    
    goTeam: function () {
      if(this.page.isCurrentScene(this)){
        this.page.changeScene('team');
      }
    },
  });
  
  Scene.TeamScene = Scene.extend({
    selector: '#team',
    
    bind: function() {
      this.$el.find('#go_vote').on('submit',this.onGoVote.bind(this));
      this.client.on('go:vote',this.goVote.bind(this));
    },
    
    onGoVote: function (e) {
      e.preventDefault();
      this.client.submit('orgTeam', $(e.target).formData());
    },
    
    goVote: function () {
      if(this.page.isCurrentScene(this)){
        this.page.changeScene('vote');
      }
    },
  });
  
  Scene.VoteScene = Scene.extend({
    selector: '#vote',

    bind: function() {
      this.$el.find('#approve').on('click',this.onVoteApprove.bind(this));
      this.$el.find('#reject').on('click',this.onVoteReject.bind(this));
      this.client.on('go:vote_result',this.goVoteResult.bind(this));
    },
    
    onVoteApprove: function (e) {
      e.preventDefault();
      this.client.submit('voteApprove');
    },

    onVoteReject: function (e){
      e.preventDefault();
      this.client.submit('voteReject');
    },
    
    goVoteResult: function (){
      if(this.page.isCurrentScene(this)){
        this.page.changeScene('vote_result');
      }
    },
  });
  
  Scene.VoteResultScene = Scene.extend({
    selector: '#vote_result',
    
    bind: function (){
      this.$el.find('#go_mission').on('click',this.onGoMission.bind(this));
      this.$el.find('#next_team').on('click',this.onNextTeam.bind(this));
      this.client.on('go:mission',this.goMission.bind(this));
      this.client.on('go:team',this.goNextTeam.bind(this));
    },
    
    onGoMission: function(e){
      e.preventDefault();
      this.client.submit('go_mission');      
    },
    onNextTeam: function(e){
      e.preventDefault();
      this.client.submit('next_team');      
    },
    goMission: function(){
      if(this.page.isCurrentScene(this)){
        this.page.changeScene('mission');
      }
    },
    goNextTeam: function(){
      if(this.page.isCurrentScene(this)){
        this.page.changeScene('team');
      }
    }
  });

  Scene.MissionScene = Scene.extend({
    selector: '#mission',
    
    bind: function(){
      this.$el.find('#mission_success').on('click',this.onMissionSuccess.bind(this));
      this.$el.find('#mission_fail').on('click',this.onMissionFail.bind(this));
      this.client.on('go:mission_result',this.goMissionResult.bind(this));
    },
    
    onMissionSuccess: function(e){
      e.preventDefault();
      this.client.submit('mission_success');
    },
    
    onMissionFail: function(e){
      e.preventDefault();
      this.client.submit('mission_fail');
    },

    goMissionResult: function(){
      if(this.page.isCurrentScene(this)){
        this.page.changeScene('mission_result');
      }
    },
  });
  
  Scene.MissionResultScene = Scene.extend({
    selector: '#mission_result',
    
    bind: function(){
      this.$el.find('#go_next_team').on('click',this.onGoNextTeam.bind(this));
      this.$el.find('#assassinate').on('click',this.onAssassinate.bind(this));
      this.$el.find('#go_game_result').on('click',this.onGoGameResult.bind(this));
      this.client.on('go:team',this.goGoNextTeam.bind(this));
      this.client.on('go:assassinate',this.goAssassinate.bind(this));
      this.client.on('go:game_result',this.goGameResult.bind(this));
    },
    
    onGoNextTeam: function(e){
      e.preventDefault();
      this.client.submit('go_team');
    },
    
    onAssassinate: function(e){
      e.preventDefault();
      this.client.submit('go_assassinate');
    },
    
    onGoGameResult: function(e){
      e.preventDefault();
      this.client.submit('go_game_result');
    },

    goGoNextTeam: function(){
      if(this.page.isCurrentScene(this)){
        this.page.changeScene('team');
      }
    },

    goAssassinate: function(){
      if(this.page.isCurrentScene(this)){
        this.page.changeScene('assassin_phase');
      }
    },

    goGameResult: function(){
      if(this.page.isCurrentScene(this)){
        this.page.changeScene('game_result');
      }
    },
  });
  
  
  Scene.AssassinPhaseScene = Scene.extend({
    selector: '#assassin_phase',
    
    bind : function(){
      this.$el.find('#assassin_assassinate').on('submit',this.onAssassinAssassinate.bind(this));
      this.client.on('go:game_result',this.goAssassinGameResult.bind(this));
    },
    
    onAssassinAssassinate: function(e){
      e.preventDefault();
      this.client.submit('go_game_result');
    },
    goAssassinGameResult: function(){
      if(this.page.isCurrentScene(this)){
        this.page.changeScene('game_result');
      }
    },
  });


  Scene.GameResultScene= Scene.extend({
    selector : '#game_result',
    bind: function(){
      this.$el.find('#next_game').on('click',this.onNextGame.bind(this));
      this.$el.find('#exit_game').on('click',this.onExitGame.bind(this));
      this.client.on('go:lobby',this.goNextGame.bind(this));
      this.client.on('go:exit',this.goExitGame.bind(this));
    },
    
    onNextGame:function(e){
      e.preventDefault();
      this.client.submit('go_lobby');
    },
    
    onExitGame:function(e){
      e.preventDefault();
      this.client.submit('go:exit');
    },

    goNextGame:function(){
      if(this.page.isCurrentScene(this)){
        this.page.changeScene('lobby');
      }
    },
    
    goExitGame:function(){
      if(this.page.isCurrentScene(this)){
        this.page.changeScene('start');
      }
    },
    
  });

}(Scene));
