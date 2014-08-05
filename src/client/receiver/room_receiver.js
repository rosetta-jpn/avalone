var Room = require('../../models/room')
  , User = require('../../models/user')
  , Base = require('./base')
  , GameReceiver = require('./game_receiver');

var RoomReceiver = module.exports = Base.extend({
  initialize: function () {
    this.listen(this.client, 'new:Room', this.onReceiveRoom.bind(this));
    this.listen(this.client, 'new:User', this.onReceiveUser.bind(this));
    this.listen(this.client, 'leave:User', this.onLeaveUser.bind(this));
    this.listen(this.client, 'new:Game', this.onNewGame.bind(this));
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

  onLeaveUser: function (json) {
    var user = this.database.createUser(json.user);
    if (this.room) this.room.leave(user);
  },

  onNewGame: function (json) {
    this.room.game = this.database.createGame(json.game);
    new GameReceiver(this.room.game);
    // this.room.emit('update:Room.game')
  }
});
