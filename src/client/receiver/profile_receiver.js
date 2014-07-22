var Base = require('./base');

var ProfileReceiver = module.exports = Base.extend({
  initialize: function () {
    this.database.player = {}
    this.database.user = {}
    this.client.on('connection', this.onConnection.bind(this));
  },

  onConnection: function (id) {
    this.database.id = id;
  },

});

