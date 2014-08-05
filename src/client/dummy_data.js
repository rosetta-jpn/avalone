var Model = require('../models')
  , utils = require('../utils');

var createDummy = module.exports = function (database) {
  var users = ['hoge', 'fuga', 'hige', 'mage', 'yuge'].map(function (name) {
    return database.addUser(new Model.User(name + '-id', name));
  })
  var room = new Model.Room(users[0], 'demo-room');
  database.addRoom(room);

  for (var i = 1; i < users.length; i++) {
    room.enter(users[i]);
  }

  var game = room.newGame(users[0]);
  database.addGame(game);

  for (var i = 0; i < users.length; i++) {
    database.createPlayer(game.players[i]);
  }

  var quest = game.quests[0]
  var team = quest.team;
  database.addQuest(quest);
  database.addTeam(team);

  team.add_group(team.selector, game.players[0]);
  team.add_group(team.selector, game.players[1]);
  team.emit('update');
}
