(function () {
  var Page = function Page() {
    this.client = new Client();
    this.scenes = {
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

    this.models = {
      profile: new Model.Profile(this),
      users: new Model.Users(this),
      players: new Model.Players(this),
      selection: new Model.Selection(this),
    }

    ViewModel.boot(this.models); 

    this.client.on('notice', this.onNotice.bind(this));
    this.client.on('go:start', this.returnStart.bind(this));

    this.changeScene('start');
  }

  Page.prototype.onNotice = function (data) {
    console.log(data.type + ':', data.value);
  }

  Page.prototype.changeScene = function (sceneId) {
    var cs = this.currentScene, ns = this.scenes[sceneId];
    if (cs && cs.onHide) cs.onHide();
    ns.show();
    if (ns && ns.onShow) ns.onShow();
    this.currentScene = ns;
  }

  Page.prototype.isCurrentScene = function (scene) {
    return this.currentScene === scene;
  }

  Page.prototype.returnStart = function () {
    if (this.isCurrentScene(this.scenes.start)) return;
    this.changeScene('start');
  }

  $(function() { window.page = new Page(); });
}());
