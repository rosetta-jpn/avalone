require('./room_extension');
require('./team_extension');
require('./game_extension');
require('./quest_extension');

var Game = require('../../models/game')
  , Team = require('../../models/team')
  , Room = require('../../models/room');

module.exports = {
  registerDatabase: function (database) {
    [Game, Team, Room].forEach(function (model) {
      model.classMethods.registerDatabase(database);
    });
  }
}
