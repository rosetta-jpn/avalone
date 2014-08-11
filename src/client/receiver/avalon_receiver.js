var Base = require('./base')
  , RoomReceiver = require('./room_receiver');

var AvalonReceiver = module.exports = Base.extend({
  initialize: function () {
    this.listen(this.client, 'new:Room', this.onReceiveRoom.bind(this));
  },

  onReceiveRoom: function (json) {
    var room = this.database.createRoom(json.room);
    var roomReceiver = new RoomReceiver(room);
  },
});
