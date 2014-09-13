var utils = require('../../utils')
  , UserCore = require('../core/user');

var User = module.exports = utils.inherit(UserCore, function User(isDisconnected, database) {
  var args = Array.prototype.slice.call(arguments, 2);
  this.superClass.apply(this, args);
  this.isDisconnected = isDisconnected;
  this.database = database;
});

utils.extend(User.classMethods, {
  parseJson: function (json, database, options) {
    return new User(json.isDisconnected, database, json.id, json.name);
  },
});

utils.extend(User.prototype, {
  /* helper methods */
});

