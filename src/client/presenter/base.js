var client = require('../client')
  , database = require('../database')
  , utils = require('../../utils');

module.exports = Presenter = function () {}

utils.extend(Presenter.prototype, {
  bind: function () {
    this.view = rivets.bind(this.$el, this.model, {
      formatters: this.formatters,
    });
  },

  update: function () {
    this.view.update(this.model);
  },

  client: client,
  database: database,
});
