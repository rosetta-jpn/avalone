(function (global) {
  var inherit = function (parent, child) {
    var bridge = function (){};
    bridge.prototype = parent.prototype;
    child.prototype = new bridge();
    return child;
  }

  var Scene = global.Scene = function (view) {
    this.view = view;
  }

  Scene.extend = function (obj) {
    var parent = this;
    var child = function (view) { 
      parent.call(this, view);
      if (this.bind) this.bind();
    };
    inherit(parent, child);
    for (var prop in obj || {}) {
      child.prototype[prop] = obj[prop];
    }
    return child;
  }

  Scene.prototype.show = function() {
    $('.scene').hide();
    this.$el.fadeIn();
  }

  Object.defineProperty(Scene.prototype, 'client', {
    get: function () { return this.view.client; },
  });

  Object.defineProperty(Scene.prototype, '$el', {
    get: function () { return this._$el || $(this.selector); },
  });

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
      if (this.view.isCurrentScene(this))
        this.view.changeScene('lobby');
    },
  });

  Scene.LobbyScene = Scene.extend({
    selector: '#lobby',

    bind: function () {
      $('a#start_game').on('click', this.onSubmitStartGame.bind(this));
    },

    onSubmitStartGame: function (e) {
      e.preventDefault();
      console.log('hoge');
    },
  });
}(this));

