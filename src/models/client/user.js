var utils = require('../../utils')
  , UserCore = require('../core/user');

var User = module.exports = utils.inherit(UserCore, function User(database) {
  var args = Array.prototype.slice.call(arguments, 1);
  this.superClass.apply(this, args);
  this.database = database;
});

utils.extend(User.classMethods, {
  parseJson: function (json, database, options) {
    return new User(database, json.id, json.name);
  },
});

utils.extend(User.prototype, {
  /* helper methods */
});

