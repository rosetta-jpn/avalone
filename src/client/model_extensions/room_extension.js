var Room = require('../../models/room')
  , database = require('../database')
  , utils = require('../../utils');

utils.property(Room.prototype, {
  canSubmit: {
    get: function () {
      return this.users.length >= 5 && this.owner.id == database.id;
    }
  }
});

