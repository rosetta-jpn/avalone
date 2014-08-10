var utils = require('../../utils');

// Public: Receiver - control models according to messages from the server.
var Base = module.exports = function () {
  this.listens = [];
  if (this.initialize) this.initialize.apply(this, arguments);
}

utils.useClassMethods(Base);

Base.extend = function () {
  var args = Array.prototype.slice.call(arguments);
  args.unshift(this);
  return utils.inherit.apply(this, args);
}

Base.classMethods.setting = function (app) {
  this.app = app;
}

utils.extend(Base.prototype, {
  listen: function (target, event, callback) {
    this.listens.push({ target: target, event: event, callback: callback });
    target.on(event, callback);
  },

  stopListening: function () {
    this.listens.forEach(function (listen) {
      listen.target.removeListener(listen.event, listen.callback);
    });
    this.listens = [];
    if (this.onStopListening) this.onStopListening();
  },
});

utils.property(Base.prototype, {
  client: {
    get: function () { return this.classMethods.app.client; },
  },

  database: {
    get: function () { return this.classMethods.app.database; },
  },

  router: {
    get: function () { return this.classMethods.app.router; },
  },
});
