var client = require('../client')
  , database = require('../database')
  , utils = require('../../utils');

module.exports = Presenter = function () {}

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

  client: client,
  database: database,
});
