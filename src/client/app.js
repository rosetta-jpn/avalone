require('../utils/extensions')
require('./rivets_config')

var Router = require('./router')
  , Client = require('./client')
  , Presenter = require('./presenter')
  , PresenterBase = require('./presenter/base')
  , Database = require('./database')
  , ReceiverBase = require('./receiver/base')
  , ProfileReceiver = require('./receiver/profile_receiver')
  , RoomReceiver = require('./receiver/room_receiver')
  , utils = require('../utils');

var App = module.exports = function App (client, ioBoot, config) {
  this.ioBoot = ioBoot || io;
  this.client = new (client || Client)(this.ioBoot);
  this.config = config;
  this.database = new Database();
}

utils.extend(App.prototype, {
  boot: function () {
    this.router = new Router(this, this.client, this.config);
    this.client.start();
    new RoomReceiver(this);
    new ProfileReceiver(this);
  },
});
