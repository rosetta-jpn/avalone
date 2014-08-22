var BasePresenter = require('./base')
  , utils = require('../../utils');

var AvalonPresenter = module.exports = utils.inherit(BasePresenter);

utils.extend(AvalonPresenter.prototype, {
  initialize: function () {
    this.model = {
      avalon: { rooms: [] },
    };
    this.database.on('new:Room', this.addRoom.bind(this));
    this.database.on('destroy:Room', this.destroyRoom.bind(this));
  },

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
});
