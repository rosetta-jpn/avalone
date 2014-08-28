var Base = require('./base')
  , GameReceiver = require('./game_receiver');

var RoomReceiver = module.exports = Base.extend({
  initialize: function () {
    this.listen(this.client, 'new:Avalon', this.onReceiveAvalon.bind(this));
    this.listen(this.client, 'new:Room', this.onReceiveRoom.bind(this));
    this.listen(this.client, 'destroy:Room', this.onDestroyRoom.bind(this));
    this.listen(this.client, 'enter:User', this.onReceiveUser.bind(this));
    this.listen(this.client, 'leave:User', this.onLeaveUser.bind(this));
    this.listen(this.client, 'new:Game', this.onNewGame.bind(this));
    this.listen(this.client, 'resume:Room', this.onResumeRoom.bind(this));
    this.listen(this.client, 'resume:Game', this.onResumeGame.bind(this));
  },

  onReceiveRoom: function (json) {
    var room = this.database.createRoom(json.room);
    this.setCurrentMyRoom(room);
  },

  onDestroyRoom: function (json) {
    this.database.destroyRoom(json.room.name);
  },

  onReceiveAvalon: function (json) {
    this.database.createAvalon(json.avalon);
  },

  onReceiveUser: function (json) {
    var user = this.database.createUser(json.user);
    var room = this.database.findRoom(json.roomName);
    if (room) {
      room.enter(user);
      this.setCurrentMyRoom(room);
    }
  },

  onLeaveUser: function (json) {
    var user = this.database.createUser(json.user);
    var room = this.database.findRoom(json.roomName);
    if (room) room.leave(user);
    this.database.destroyUser(user.id);
    if (user.id === this.database.id) this.database.currentRoom = null;
  },

  onNewGame: function (json) {
    var room = this.database.currentRoom
    if (!room) return;
    room.game = this.database.createGame(json.game);
    this.database.currentGame = room.game;
    new GameReceiver(this.app, room.game);
  },

  onResumeRoom: function (json) {
    var room = this.database.createRoom(json);
    this.database.currentRoom = room;
    this.router.changeScene('lobby');
  },

  onResumeGame: function (json) {
    var room = this.database.currentRoom;
    this.database.currentGame = room.game;
    if (!room) return;
    room.game = this.database.createGame(json.game);
    var gameReceiver = new GameReceiver(this.app, room.game);
    gameReceiver.resumeGame(room.game);
  },

  /* controller methods */

  setCurrentMyRoom: function (room) {
    if (room.hasMe()) this.database.currentRoom = room;
  },

  afterAction: function () {
    for (var name in this.database.Room) {
      this.database.Room[name].emit('update');
    }
  },
});
