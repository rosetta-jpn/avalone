var utils = require('../../utils');

// Public: Receiver - control models according to messages from the server.
var Base = module.exports = function (app) {
  this.app = app;
  this.listens = [];
  var args = Array.prototype.slice.call(arguments, 1);
  if (this.initialize) this.initialize.apply(this, args);
}

utils.useClassMethods(Base);

Base.extend = function () {
  var args = Array.prototype.slice.call(arguments);
  args.unshift(this);
  return utils.inherit.apply(this, args);
}

utils.extend(Base.prototype, {
  listen: function (target, event, callback) {
    var self = this;

    function dispatch() {
      var args = Array.prototype.slice.apply(arguments);
      var originalArgs = arguments;
      args.unshift(next);

      if (self.beforeAction) {
        self.beforeAction.apply(self, args);
      } else {
        next();
      }

      function next() {
        callback.apply(self, originalArgs);
        if (self.afterAction) self.afterAction();
      }
    }
    this.listens.push({ target: target, event: event, callback: dispatch });
    target.on(event, dispatch);
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
    get: function () { return this.app.client; },
  },

  database: {
    get: function () { return this.app.database; },
  },

  router: {
    get: function () { return this.app.router; },
  },
});
