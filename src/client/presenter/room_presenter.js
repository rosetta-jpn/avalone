var BasePresenter = require('./base')
  , utils = require('../../utils');

var RoomPresenter = module.exports = utils.inherit(BasePresenter);

utils.extend(RoomPresenter.prototype, {
  initialize: function () {
    this.model = {
      room: this.database.currentRoom,
    };

    this.database.on('change:currentRoom', this.changeRoom.bind(this));
  },

  selector: '.rv-room',

  changeRoom: function (room) {
    this.model.room = room;
    this.update();
    utils.log('Update:Room', this.model);
  },

  formatters: {
    toClassName: function (name) { return 'room-' + name; },
  },
});

