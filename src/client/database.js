var Model = require('../models')
  , utils = require('../utils')
  , events = require('events');

var Database = function () {
  for (var key in identifiers) {
    this[key] = {};
  }
}

utils.inherit(events.EventEmitter, Database);

var identifiers = {
  User: 'id',
  Player: 'id',
  Room: 'name',
}

utils.property(Database.prototype, {
  userProfile: {
    get: function () {
      if (this.id) return this.findUser(this.id);
    },
  },

  playerProfile: {
    get: function () {
      if (this.id) return this.findPlayer(this.id);
    },
  },
});

Object.keys(Model).forEach(function (key) {
  var identifier = identifiers[key];

  var createMethodName = 'create' + key;
  Database.prototype[createMethodName] = function (json) {
    return this[parseMethodName](json, true);
  }

  var parseMethodName = 'parse' + key;
  Database.prototype[parseMethodName] = function (json, save) {
    var findResult = this[findMethodName](identifier ? json[identifier] : null)
    if (findResult) return findResult;
    var readResult = this['read' + key](json, save);
    if (save) return this[addMethodName](readResult);
    else readResult;
  }

  var findMethodName = 'find' + key;
  Database.prototype[findMethodName] = function (id) {
    if (identifier) {
      return this[key][id];
    } else {
      return this[key];
    }
  }

  var addMethodName = 'add' + key;
  Database.prototype[addMethodName] = function (obj) {
    this.notify('new:' + key, obj);
    if (identifier) {
      var id = obj[identifier];
      return this[key][id] = obj;
    } else {
      return this[key] = obj;
    }
  }

  Database.prototype['update' + key] = function (json) {
    var findResult = this[findMethodName](identifier ? json[identifier] : null)
    if (findResult) {
      findResult.mergeJson()
    }

    if (identifier) {
      var id = json[identifier];
      return this[key][id] = this[parseMethodName](json);
    } else {
      return this[key] = this[parseMethodName](json);
    }
  }

  Database.prototype['delete' + key] = function (id) {
    if (identifier) {
      delete this[key][id];
    } else {
      delete this[key];
    }
  }

});

Database.prototype.readGame = function (json, save) {
  var self = this;
  players = json.players.map(function (obj) { return self.parsePlayer(obj, save); });
  var game = new Model.Game(players);
  game.quests = (json.quests || []).map(function (obj) { return self.parseQuest(obj, save); });
  game.selectorIdx = json.selectorIdx;
  return game;
}

Database.prototype.readQuest = function (json, save) {
  var quest = new Model.Quest(this.findGame(), json.success_number, json.team_sz);
  if (json.team) quest.team = this.parseTeam(json.team, save);
  return quest;
}

Database.prototype.readTeam = function (json, save) {
  var selector;
  if (!players) {
    selector = this.parsePlayer(json.selector, save);
  } else {
    selector = this.findPlayer(json.selector)
  }
  var team = new Model.Team(selector, json.group_sz, json.voter_sz);
  team.group = json.group;
  team.voter_map = json.voter_map;
}

Database.prototype.readUser = function (json, save) {
  return new Model.User(json.id, json.name);
}

Database.prototype.readPlayer = function (json, save) {
  var klass = Model.PlayerModule[json.class];
  var user = this.parseUser(json, save);
  if (!klass) klass = Model.Player;
  return new klass(user);
}

Database.prototype.readRoom = function (json, save) {
  var self = this;
  var owner = this.parseUser(json.owner, save);
  var room = new Model.Room(owner, json.name);
  json.users.forEach(function (obj) {
    room.enter(self.parseUser(obj, save));
  });
  if (json.game) room.game = this.parseGame(json.game, save);
  return room;
}

Database.prototype.notify = function (type, obj) {
  console.log('Database:', type, obj);
  return this.emit(type, obj);
}

module.exports = new Database;