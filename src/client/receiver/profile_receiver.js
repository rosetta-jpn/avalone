var Base = require('./base');

var ProfileReceiver = module.exports = Base.extend({
  initialize: function () {
    this.database.player = {}
    this.database.user = {}
    this.listen(this.client, 'connection', this.onConnection.bind(this));
    this.listen(this.client, 'relogin', this.onRelogin.bind(this));
  },

  onConnection: function (id) {
    this.database.id = id;
  },

  onRelogin: function (json) {
    this.database.id = json.id;
  },

});

