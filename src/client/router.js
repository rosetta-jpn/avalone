var Scene = require('./scene');
var Client = require('./client');

var Router = module.exports = function Router(client) {
  this.client = client;
  this.standbyScenes();

  this.client.on('go:start', this.returnStart.bind(this));
  this.changeScene('start');
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
  console.log('SceneChange:', sceneId);
  nextScene.show();
  location.hash = sceneId;
  if (nextScene && nextScene.onShow) nextScene.onShow();
  this.currentScene = nextScene;
}

Router.prototype.isCurrentScene = function (scene) {
  return this.currentScene === scene;
}

Router.prototype.returnStart = function () {
  if (this.isCurrentScene(this.scenes.start)) return;
  this.changeScene('start');
}
