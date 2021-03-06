var AbstractScene = require('./abstract_scene');

var Scene = module.exports = {};

Scene.StartScene = AbstractScene.extend({
  selector: '#start',
  name: 'start',

  bind: function () {
    $('form#enterRoom').on('submit', this.onSubmitRoom.bind(this));
    this.$el.find('button.debug').on('click', this.onDebug.bind(this));
    this.client.on('go:lobby', this.goLobby.bind(this))
  },

  onSubmitRoom: function (e) {
    e.preventDefault();
    this.client.submit('enter', $(e.target).formData());
  },

  onDebug: function (e) {
    e.preventDefault();
    this.client.submit('debug');
  },

  goLobby: function () {
    if (this.router.isCurrentScene(this))
      this.router.changeScene('lobby');
  },
});

Scene.LobbyScene = AbstractScene.extend({
  selector: '#lobby',
  name: 'lobby',
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
    if(this.router.isCurrentScene(this)){
      this.router.changeScene('jobs');
    }
  },
});

Scene.JobsScene = AbstractScene.extend({
  selector: '#jobs',
  name: 'jobs',

  bind: function() {
    this.$el.find('#go_team').on('click',this.goTeam.bind(this));
  },

  goTeam: function () {
    this.router.reserveChangeScene('jobs', 'team');
  },
});

Scene.TeamScene = AbstractScene.extend({
  selector: '#team',
  name: 'team',

  bind: function() {
    this.$el.find('#go_vote').on('submit',this.onGoVote.bind(this));
    this.client.on('go:vote', this.goVote.bind(this));
    this.$el.find('button.debug').on('click', this.onDebug.bind(this));
  },

  onShow: function () {
    this.router.applyCurrentModels();
  },

  onGoVote: function (e) {
    e.preventDefault();
    this.client.submit('orgTeam', $(e.target).formData());
  },

  onDebug: function (e) {
    e.preventDefault();
    this.client.submit('debugTeam');
  },

  goVote: function () {
    this.router.reserveChangeScene('team', 'vote');
  },
});

Scene.VoteScene = AbstractScene.extend({
  selector: '#vote',
  name: 'vote',

  bind: function() {
    this.$el.find('button.debugApprove').on('click', this.onDebug.bind(this, true));
    this.$el.find('button.debugReject').on('click', this.onDebug.bind(this, false));
    this.client.on('go:vote_result',this.goVoteResult.bind(this));
  },

  onDebug: function (isApprove, e) {
    e.preventDefault();
    this.client.submit('debugVote', isApprove);
  },

  goVoteResult: function (){
    this.router.reserveChangeScene('vote', 'vote_result');
  },
});

Scene.VoteResultScene = AbstractScene.extend({
  selector: '#vote_result',
  name: 'vote_result',

  bind: function (){
    this.$el.find('#go_mission').on('click',this.onGoMission.bind(this));
    this.$el.find('#next_team').on('click',this.onNextTeam.bind(this));
  },

  onGoMission: function(e){
    e.preventDefault();
    if(this.router.isCurrentScene(this)){
      this.router.changeScene('mission');
    }
  },

  onNextTeam: function(e){
    e.preventDefault();
    if(this.router.isCurrentScene(this)){
      this.router.changeScene('team');
    }
  },
});

Scene.MissionScene = AbstractScene.extend({
  selector: '#mission',
  name: 'mission',

  bind: function(){
    this.$el.find('#mission_success').on('click',this.onMissionSuccess.bind(this));
    this.$el.find('#mission_fail').on('click',this.onMissionFail.bind(this));
    this.$el.find('button.debug-success').on('click', this.onDebug.bind(this, true));
    this.$el.find('button.debug-failure').on('click', this.onDebug.bind(this, false));
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

  onDebug: function (isSuccess, e) {
    e.preventDefault();
    this.client.submit('debugMission', isSuccess);
  },

  goMissionResult: function(){
    if(this.router.isCurrentScene(this)){
      this.router.changeScene('mission_result');
    }
  },
});

Scene.MissionResultScene = AbstractScene.extend({
  selector: '#mission_result',
  name: 'mission_result',

  bind: function(){
    this.$el.find('#go_next_team').on('click',this.onGoNextTeam.bind(this));
    this.$el.find('#assassinate').on('click',this.onAssassinate.bind(this));
    this.$el.find('#go_game_result').on('click',this.onGoGameResult.bind(this));
  },

  onGoNextTeam: function(e){
    e.preventDefault();
    if(this.router.isCurrentScene(this)){
      this.router.changeScene('team');
    }
  },

  onAssassinate: function(e){
    e.preventDefault();
    if(this.router.isCurrentScene(this)){
      this.router.changeScene('assassin_phase');
    }
  },

  onGoGameResult: function(e){
    e.preventDefault();
    if(this.router.isCurrentScene(this)){
      this.router.changeScene('game_result');
    }
  },
});

Scene.AssassinPhaseScene = AbstractScene.extend({
  selector: '#assassin_phase',
  name: 'assassin_phase',

  bind : function(){
    this.$el.find('#assassin_assassinate').on('submit',this.onAssassinAssassinate.bind(this));
    this.client.on('go:game_result',this.goAssassinGameResult.bind(this));
  },

  onAssassinAssassinate: function(e){
    e.preventDefault();
    this.client.submit('go_game_result');
  },
  goAssassinGameResult: function(){
    if(this.router.isCurrentScene(this)){
      this.router.changeScene('game_result');
    }
  },
});


Scene.GameResultScene= AbstractScene.extend({
  selector : '#game_result',
  name: 'game_result',

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
    if(this.router.isCurrentScene(this)){
      this.router.changeScene('lobby');
    }
  },

  goExitGame:function(){
    if(this.router.isCurrentScene(this)){
      this.router.changeScene('start');
    }
  },

});

