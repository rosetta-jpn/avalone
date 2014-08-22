var utils = require('../../utils')
  , RoomCore = require('../core/room');

var Room = module.exports = utils.inherit(RoomCore, function Room(database, users, game) {
  var args = Array.prototype.slice.call(arguments, 3);
  this.superClass.apply(this, args);
  this.database = database;
  this.users = users;
  this.game = game;
});

utils.extend(Room.classMethods, {
  parseJson: function (json, database, options) {
    var game = database.findGame(json.gameId)
      , users = json.users.map(function (user) { return database.parseUser(user, options) })
      , owner = database.parseUser(json.owner, options);

    return new Room(database, users, game, owner, json.name);
  },
});

utils.extend(Room.prototype, {
  /* helper methods */

  amIOwner: function () {
    return this.owner.id == this.database.id;
  },

  hasMe: function () {
    return !!this.userList[this.database.id];
  },

  canStartGame: function () {
    return this.amIOwner() && this.users.length >= 5
  },
});

