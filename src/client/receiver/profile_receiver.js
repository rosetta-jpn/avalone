var Base = require('./base');

var ProfileReceiver = module.exports = Base.extend({
  initialize: function () {
    this.database.player = {}
    this.database.user = {}
    this.listen(this.client, 'connection', this.onConnection.bind(this));
  },

  onConnection: function (id) {
    this.database.id = id;
  },

});

