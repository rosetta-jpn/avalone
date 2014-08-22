var ClientModel = require('../models/client')
  , utils = require('../utils')
  , events = require('events')
  , createDummy = require('./dummy_data')

var ModelNames = Object.keys(ClientModel);

// Public: Database - parse received json objects and store them.
var Database = module.exports = function Database() {
  for (var i = 0; i < ModelNames.length; i++) {
    this[ModelNames[i]] = {};
  }
}

var identifiers = {
  Room: 'name',
}

utils.inherit(events.EventEmitter, Database);

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

utils.extend(Database.prototype, {
  createDummy: function () {
    createDummy(this);
  },

  log: function () {
    var args = Array.prototype.slice.call(arguments);
    args.unshift('Database:');
    utils.log.apply(console, args)
  },

  notify: function (type, obj) {
    this.log(type, obj);
    return this.emit(type, obj);
  },

  updatePlayerPersonas: function (json) {
    var persona = ClientModel.Player.classMethods.readPersona(json.class);
    var player = this.findPlayer(json.id);
    if (player && player.changePersona) {
      player.changePersona(persona);
      utils.log('ChangePersona:', player.className);
    }
  },
});

// Define CRUD methods for each Model.
ModelNames.forEach(function (key) {
  var identifier = identifiers[key] || 'id';
  var model = ClientModel[key];

  // Public: create{Model} - Parse Model's instance from json object and store in the database.
  var createMethodName = 'create' + key;
  Database.prototype[createMethodName] = function (json) {
    return this[parseMethodName](json, { save: true });
  }

  // Public: parse{Model} - Parse Model's instance from json object.
  var parseMethodName = 'parse' + key;
  Database.prototype[parseMethodName] = function (json, options) {
    options = options || {};
    var findResult = this[findMethodName](identifier ? json[identifier] : null)
    if (findResult && options.save) return this[updateMethodName](json, options);
    var readResult = model.classMethods.parseJson(json, this, options);

    if (options.save) {
      return this[addMethodName](readResult);
    } else {
      return readResult;
    }
  }

  // Public: find{Model} - Search the model in the database from its id.
  var findMethodName = 'find' + key;
  Database.prototype[findMethodName] = function (id) {
    if (identifier) {
      return this[key][id];
    } else {
      return this[key];
    }
  }

  // Public: add{Model} - Store object in the database.
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

  // Public: update{Model} - Update object in the database.
  var updateMethodName = 'update' + key;
  Database.prototype[updateMethodName] = function (json, options) {
    var findResult = this[findMethodName](identifier ? json[identifier] : null)
    if (findResult && model.classMethods.mergeJson) {
      model.classMethods.mergeJson(findResult, json, this, options)
    }
    return findResult;
  }

  // Public: destroy{Model} - Search the model in the database and remove it.
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

  var property = {};
  var currentPropName = 'current' + key;
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
