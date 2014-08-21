var Model = require('../models')
  , utils = require('../utils')
  , events = require('events')
  , createDummy = require('./dummy_data')

var ModelNames = Object.keys(Model);

// Public: Database - parse received json objects and store them.
var Database = module.exports = function () {
  for (var i = 0; i < ModelNames.length; i++) {
    this[ModelNames[i]] = {};
  }
  this.standbyRoomList();
}

utils.inherit(events.EventEmitter, Database);
Database.prototype.standbyRoomList = function () {
  var self = this;
  this.avalon = { rooms: [] };
  this.on('new:Room', function (obj) {
    self.avalon.rooms.push(obj);
  });
}

Database.prototype.createDummy = function () {
  createDummy(this);
}

var identifiers = {
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

ModelNames.forEach(function (key) {
  var identifier = identifiers[key] || 'id';

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
    if (identifier) {
      var id = obj[identifier];
      this[key][id] = obj;
    } else {
      this[key] = obj;
    }
    this.notify('new:' + key, obj);
    return obj;
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

  Database.prototype['destroy' + key] = function (id) {
    var list = this[key];
    var value = this[findMethodName](id);
    if (identifier) {
      delete list[id];
    } else {
      delete this[key];
    }
    if (value) {
      this.notify('destroy:' + key, value);
      if (identifier && this[currentPropName])
        if (this[currentPropName][identifier] == id) {
          this[currentPropName] = null;
        }
    }
  }

  var currentPropName = 'current' + key;
  var property = {};
  property[currentPropName] = {
    get: function () {
      return this['_current' + key];
    },

    set: function (newObj) {
      var oldObj = this['_current' + key];
      this['_current' + key] = newObj;
      if (newObj !== oldObj) {
        this.log('change:current' + key, newObj);
        this.notify('change:current' + key, newObj);
      }
      return newObj;
    },
  }

  utils.property(Database.prototype, property);
});

Database.prototype.readGame = function (json, save) {
  var self = this;
  players = json.players.map(function (obj) { return self.parsePlayer(obj, save); });
  var game = new Model.Game(players, json.id);
  game.state = json.state;
  game.quests = (json.quests || []).map(function (obj) { return self.parseQuest(obj, save); });
  game.selectorIdx = json.selectorIdx;
  return game;
}

Database.prototype.readQuest = function (json, save) {
  var self = this;
  var quest = new Model.Quest(this.currentGame, json.success_number, json.team_sz, json.id);
  quest.state = json.state;
  if (json.teams) quest.teams = json.teams.map(function (team) { return self.parseTeam(team, save); });
  return quest;
}

Database.prototype.readTeam = function (json, save) {
  var selector = this.parsePlayer(json.selector, save);
  var team = new Model.Team(this.currentGame, selector, json.group_sz, json.voter_sz, json.id);
  team.state = json.state;
  team.group = json.group;
  team.voter_map = json.voter_map;
  if (json.game_id) {
    this._autoSetGame(team, json.game_id)
  }
  return team;
}

Database.prototype.readUser = function (json, save) {
  return new Model.User(json.id, json.name);
}

Database.prototype.readPlayer = function (json, save) {
  var klass = Model.PlayerModule.readClass(json.class);
  var user = this.parseUser(json, save);
  var player = new Model.PlayerModule.Unknown(user);
  player.changePersona(klass);
  return player;
}

Database.prototype.readRoom = function (json, save) {
  var self = this;
  var owner = this.parseUser(json.owner, save);
  var room = new Model.Room(owner, json.name);
  json.users.forEach(function (obj) {
    room.enter(self.parseUser(obj, save));
  });
  return room;
}

Database.prototype.log = function () {
  var args = Array.prototype.slice.call(arguments);
  args.unshift('Database:');
  utils.log.apply(console, args)
}

Database.prototype.notify = function (type, obj) {
  this.log(type, obj);
  return this.emit(type, obj);
}

Database.prototype.updatePersona = function (json) {
  var persona = Model.PlayerModule.readClass(json.class);
  var player = this.findPlayer(json.id);
  if (player && player.changePersona) {
    player.changePersona(persona);
    utils.log('ChangePersona:', player.className);
  }
}

Database.prototype._autoSetGame = function (obj, game_id) {
  var game = this.findGame(game_id);
  if (game) obj.game = game; 
  else this.once('new:Game', this._autoSetGame.bind(this, obj, game_id));
}
