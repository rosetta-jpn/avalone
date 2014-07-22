var Room = require('../../models/room')
  , User = require('../../models/user')
  , Base = require('./base')
//  , GameReceiver = require('./game_receiver');

var RoomReceiver = module.exports = Base.extend({
  initialize: function () {
    this.onReceiveRoom = this.onReceiveRoom.bind(this);
    this.onReceiveUser = this.onReceiveUser.bind(this)
    this.onNewGame = this.onNewGame.bind(this)

    this.client.on('new:Room', this.onReceiveRoom);
    this.client.on('new:User', this.onReceiveUser);

    this.client.on('new:Game', this.onNewGame);
  },

  onReceiveRoom: function (json) {
    this.room = this.database.createRoom(json.room);
    // this.room.emit('update:Room')
  },

  onReceiveUser: function (json) {
    var user = this.database.createUser(json.user);
    if (this.room) this.room.enter(user);
    // this.room.emit('update:Room.users')
  },

  onNewGame: function (game) {
    this.room.game = this.database.createGame(json.game);
    // new GameReceiver(this.room.game);
    // this.room.emit('update:Room.game')
  }
});
