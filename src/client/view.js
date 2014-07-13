(function () {
  var View = function View() {
    this.client = new Client();
    this.scenes = {
      start: new Scene.StartScene(this),
      lobby: new Scene.LobbyScene(this),
    };
    this.client.on('notice', this.onNotice.bind(this));

    this.changeScene('start');
  }

  View.prototype.onNotice = function (data) {
    console.log(data.type + ':', data.value);
  }

  View.prototype.changeScene = function (sceneId) {
    var cs = this.currentScene, ns = this.scenes[sceneId];
    if (cs && cs.onHide) cs.onHide();
    ns.show();
    if (ns && ns.onShow) ns.onShow();
    this.currentScene = ns;
  }

  View.prototype.isCurrentScene = function (scene) {
    return this.currentScene === scene;
  }

  $(function() { window.view = new View(); });
}());
