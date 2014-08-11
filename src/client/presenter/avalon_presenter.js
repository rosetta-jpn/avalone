var BasePresenter = require('./base')
  , utils = require('../../utils');

AvalonPresenter = module.exports = function (range) {
  this.model = {
    avalon: { rooms: [] },
  };
  this.bind(range);
  this.database.on('new:Room', this.addRoom.bind(this));
  this.database.on('destroy:Room', this.destroyRoom.bind(this));
}

utils.inherit(BasePresenter, AvalonPresenter);
utils.extend(AvalonPresenter.prototype, {
  selector: '.rv-avalon',

  addRoom: function (room) {
    this.model.avalon.rooms.push(room);
  },

  destroyRoom: function () {
    this.model.avalon.rooms = Object.values(this.database.Room);
  },

  formatters: {
    toClassName: function (name) { return 'room-' + name; },
  },
})
