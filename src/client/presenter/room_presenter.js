var BasePresenter = require('./base')
  , utils = require('../../utils');

RoomPresenter = module.exports = function (range) {
  this.model = {
    room: this.database.currentRoom,
  };
  this.bind(range);

  this.database.on('change:currentRoom', this.changeRoom.bind(this));
}

utils.inherit(BasePresenter, RoomPresenter);

RoomPresenter.prototype.selector = '.rv-room'

RoomPresenter.prototype.changeRoom = function (room) {
  this.model.room = room;
  this.update();
  console.log('Update:Room', this.model);
}

RoomPresenter.prototype.formatters = {
  toClassName: function (name) { return 'room-' + name; },
}

