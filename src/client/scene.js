(function (global) {
  var inherit = function (parent, child) {
    var bridge = function (){};
    bridge.prototype = parent.prototype;
    child.prototype = new bridge();
    return child;
  }

  var Scene = global.Scene = function (page) {
    this.page = page;
  }

  Scene.extend = function (obj) {
    var parent = this;
    var child = function (page) { 
      parent.call(this, page);
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
    get: function () { return this.page.client; },
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
      if (this.page.isCurrentScene(this))
        this.page.changeScene('lobby');
    },
  });

  Scene.LobbyScene = Scene.extend({
    selector: '#lobby',
    users: {},

    bind: function () {
      $('a#start_game').on('click', this.onSubmitStartGame.bind(this));
      this.client.on('enterRoom', this.onUserEnterRoom.bind(this))
      this.client.on('leaveRoom', this.onUserLeaveRoom.bind(this))
    },

    onSubmitStartGame: function (e) {
      e.preventDefault();
      console.log('hoge');
    },

    onUserEnterRoom: function (data) {
      var user = data.user;
      if (!this.users[user.id]) {
        this.users[user.id] = user;
        var newDom = $('<li>').attr({id: 'user-' + user.id}).text(user.name);
        this.$el.find('.users').append(newDom);
      }
    },

    onUserLeaveRoom: function (data) {
      var user = data.user;
      delete this.users[user.id]
      this.$el.find('#user-' + user.id).remove();
    }
  });
}(this));

