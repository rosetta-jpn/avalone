var BasePresenter = require('./base')
  , utils = require('../../utils');

AvalonPresenter = module.exports = function (range) {
  this.model = {
    avalon: { rooms: [] },
  };
  this.bind(range);
  this.database.on('new:Room', this.addRoom.bind(this));
}

utils.inherit(BasePresenter, AvalonPresenter);
utils.extend(AvalonPresenter.prototype, {
  selector: '.rv-avalon',

  addRoom: function (room) {
    this.model.avalon.rooms.push(room);
  },

  formatters: {
    toClassName: function (name) { return 'room-' + name; },
  },
})
