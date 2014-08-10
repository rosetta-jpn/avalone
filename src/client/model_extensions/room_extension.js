var Room = require('../../models/room')
  , database = require('../database')
  , utils = require('../../utils');

utils.extend(Room.classMethods, {
  registerDatabase: function (database) {
    this.database = database;
  },
})

utils.property(Room.prototype, {
  canSubmit: {
    get: function () {
      return this.users.length >= 5 && this.owner.id == this.classMethods.database.id;
    }
  }
});

