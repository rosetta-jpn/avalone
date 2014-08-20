var utils = require('../../utils')
  , events = require('events')
  , User = require('./user')
  , Room = require('./room')
  , roomModule = require('../../utils/room_module');

// Public: Avalon - treat Users and Rooms
var Avalon = module.exports = function Avalon() {
  this.rooms = {};
  this.users = {};
}

utils.inherit(events.EventEmitter, Avalon);
utils.extend(Avalon.prototype, roomModule('users', 'socketId'));

utils.extend(Avalon.prototype, {
  toJson: function (user) {
    function toJson(obj) { return obj.toJson(user); }
    return {
      rooms: Object.values(this.rooms).map(toJson),
    }
  },
});

