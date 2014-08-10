var utils = require('../../utils');

// Public: Presenter - Show models by rivets.js and manage views.
module.exports = Presenter = function () {}

utils.useClassMethods(Presenter);
Presenter.classMethods.setting = function (app) {
  this.app = app;
}

utils.extend(Presenter.prototype, {
  bind: function (range) {
    var self = this;
    this.$el = (range || $).find(this.selector);
    this.view = rivets.bind(this.$el, this.model, {
      formatters: this.formatters,
      config: {
        handler: function (context, ev, binding) {
          return this.call(self, ev, context, binding);
        }
      }
    });
  },

  update: function () {
    console.log('Update:View', this);
    this.view.update(this.model);
    this.view.sync();
  },

  prepareModel: function (model) {
    model.handlers = this.eventHandlers;
    this.model = model;
    return model;
  },

  lock: function (name) {
    if (this['_lock-' + name]) return;
    var original = this[name];
    var argQueue = [];
    this['_lock-' + name] = { original: original, queue: argQueue };
    this[name] = function () {
      var args = Array.prototype.slice.call(arguments);
      argQueue.push(args);
      console.log('lock', arguments);
    }
  },

  unlock: function (name) {
    var save = this['_lock-' + name];
    if (!save) return;
    delete this['_lock-' + name];
    this[name] = save.original;
    for (var i = 0; i < save.queue.length; i++) {
      save.original.apply(this, save.queue[i]);
    }
  },
});

utils.property(Presenter.prototype, {
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
