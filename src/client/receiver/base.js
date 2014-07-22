var utils = require('../../utils');
var Base = module.exports = function () {
  if (this.initialize) this.initialize.apply(this, arguments);
}

utils.useClassMethods(Base);

Base.extend = function () {
  var args = Array.prototype.slice.call(arguments);
  args.unshift(this);
  return utils.inherit.apply(this, args);
}

Base.classMethods.setting = function (client, database) {
  this.client = client;
  this.database = database;
}

utils.property(Base.prototype, {
  client: {
    get: function () { return this.classMethods.client; },
  },

  database: {
    get: function () { return this.classMethods.database; },
  },
});
