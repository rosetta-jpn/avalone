var Room = require('../../models/room')
  , User = require('../../models/user')
  , Base = require('./base')
  , GameReceiver = require('./game_receiver');

var RoomReceiver = module.exports = Base.extend({
  initialize: function () {
    this.listen(this.client, 'Rooms', this.onReceiveRoomList.bind(this));
    this.listen(this.client, 'new:Room', this.onReceiveRoom.bind(this));
    this.listen(this.client, 'enter:User', this.onReceiveUser.bind(this));
    this.listen(this.client, 'leave:User', this.onLeaveUser.bind(this));
    this.listen(this.client, 'new:Game', this.onNewGame.bind(this));
    this.listen(this.client, 'resume:Room', this.onResumeRoom.bind(this));
    this.listen(this.client, 'resume:Game', this.onResumeGame.bind(this));
  },

  onReceiveRoom: function (json) {
    this.database.createRoom(json.room);
  },

  onReceiveRoomList: function (json) {
    for (var i = 0; i < json.rooms.length; i++) {
      this.database.createRoom(json.rooms[i]);
    }
  },

  onReceiveUser: function (json) {
    var user = this.database.createUser(json.user);
    var room = this.database.findRoom(json.roomName);
    if (room) room.enter(user);
    if (user.id === this.database.id) this.database.currentRoom = room;
  },

  onLeaveUser: function (json) {
    var user = this.database.createUser(json.user);
    var room = this.database.findRoom(json.roomName);
    if (room) this.room.leave(user);
    if (user.id === this.database.id) this.database.currentRoom = null;
  },

  onNewGame: function (json) {
    var room = this.database.currentRoom
    if (!room) return;
    room.game = this.database.createGame(json.game);
    this.database.currentGame = room.game;
    new GameReceiver(room.game);
  },

  onResumeRoom: function (json) {
    var room = this.database.createRoom(json);
    this.router.changeScene('lobby');
  },

  onResumeGame: function (json) {
    var room = this.database.findRoom(json.roomId);
    if (!room) return;
    room.game = this.database.createGame(json.game);
    var gameReceiver = new GameReceiver(room.game);
    gameReceiver.resumeGame(room.game);
    this.database.currentGame = room.game;
  },
});
