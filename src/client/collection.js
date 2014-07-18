var AbstractCollection = require('./abstract_collection');

var Profile = exports.Profile = AbstractCollection.extend({
  bind: function () {
    this.data.player = {}
    this.data.user = {}
    this.client.on('connection', this.onConnection.bind(this));
    this.client.on('players', this.onReceivePlayers.bind(this));
    this.client.on('room', this.onReceiveRoom.bind(this));
  },

  onConnection: function (id) {
    this.update(this.data.user, 'id', id);
  },

  onReceiveRoom: function (data) {
    this.update(this.data, 'room', data.room);
  },

  onReceivePlayers: function (data) {
    for (var i = 0; i < data.players.length; i++) {
      if (data.players[i].id === this.data.user.id) {
        this.update(this.data, 'player', data.players[i]);
        return;
      }
    }
  },

});

var Selection = exports.Selection = AbstractCollection.extend({
  bind: function () {
    this.data.selection = {
      selector: {},
      teamSize: 0,
      successSize: 0,
    };
    this.client.on('selection', this.onReceiveSelection.bind(this));
  },

  onReceiveSelection: function (selection) {
    this.update(this.data, 'selection', selection);
  },
});

var Users = exports.Users = AbstractCollection.extend({
  bind: function () {
    this.data.users = [];
    this.client.on('enterRoom', this.onUserEnterRoom.bind(this));
    this.client.on('leaveRoom', this.onUserLeaveRoom.bind(this));
    this.client.on('room', this.onReceiveRoom.bind(this));
  },

  onUserEnterRoom: function (data) {
    var user = data.user;
    this.data.users.push(user);
  },

  onUserLeaveRoom: function (data) {
    var user = data.user;
    this.remove(this.data.users, user);
  },

  onReceiveRoom: function (data) {
    this.update(this.data, 'users', data.users);
  },
});

var Players = exports.Players = AbstractCollection.extend({
  bind: function () {
    this.data.players = []
    this.client.on('players', this.onReceivePlayers.bind(this));
  },

  onReceivePlayers: function (data) {
    this.update(this.data, 'players', data.players);
  },
});

