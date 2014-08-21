var Scene = require('./scene')
  , Client = require('./client')
  , Presenter = require('./presenter')
  , utils = require('../utils');

// Public: Router - manage scenes and make scenes transit.
var Router = module.exports = function Router(app, client, config) {
  this.app = app;
  this.client = client;
  this.reservation = {};
  this.standbyScenes();
  this.config = config || { changeLocation: true };

  this.client.on('go:start', this.returnStart.bind(this));
  this.changeScene('start');
  this.presenters = Presenter(app, this.config.range);
}

Router.prototype.standbyScenes = function () {
  return this.scenes = {
    start: new Scene.StartScene(this),
    lobby: new Scene.LobbyScene(this),
    jobs: new Scene.JobsScene(this),
    team: new Scene.TeamScene(this),
    vote: new Scene.VoteScene(this),
    vote_result: new Scene.VoteResultScene(this),
    mission: new Scene.MissionScene(this),
    mission_result: new Scene.MissionResultScene(this),
    assassin_phase: new Scene.AssassinPhaseScene(this),
    game_result: new Scene.GameResultScene(this),
  };
}

Router.prototype.changeScene = function (sceneId) {
  var currentScene = this.currentScene, nextScene = this.scenes[sceneId];
  if (currentScene && currentScene.onHide) currentScene.onHide();
  utils.log('SceneChange:', sceneId);
  nextScene.show();
  if (this.config.changeLocation) location.hash = sceneId;
  if (nextScene && nextScene.onShow) nextScene.onShow();
  this.currentScene = nextScene;
  this.checkReservation();
}

Router.prototype.reserveChangeScene = function (fromId, toId) {
  this.reservation[fromId] = toId;
  this.checkReservation();
}

Router.prototype.checkReservation = function () {
  for (var fromId in this.reservation) {
    if (this.isCurrentScene(this.scenes[fromId])) {
      var toId = this.reservation[fromId];
      delete this.reservation[fromId];
      return this.changeScene(toId);
    }
  }
}

Router.prototype.isCurrentScene = function (scene) {
  return this.currentScene === scene;
}

Router.prototype.returnStart = function () {
  if (this.isCurrentScene(this.scenes.start)) return;
  this.changeScene('start');
}

Router.prototype.applyCurrentModels = function () {
  this.presenters.TeamPresenter.updateCurrentTeam();
  this.presenters.QuestPresenter.updateCurrentQuest();
}

