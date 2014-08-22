var utils = require('../../utils')
  , AvalonCore = require('../core/avalon')

var Avalon = utils.inherit(AvalonCore, function Avalon(database, rooms) {
  var args = Array.prototype.slice.call(arguments, 2);
  this.superClass.apply(this, args);
  this.database = database;
  this.rooms = rooms;
});

utils.extend(Avalon.classMethods, {
  parseJson: function (json, database, options) {
    var rooms = json.rooms.map(function (room) { return database.parseRoom(room, options); });
    return new Avalon(database, rooms);
  },
});
