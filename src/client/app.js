require('../utils/extensions')
require('./rivets_config')
var ModelExtensions = require('./model_extensions')

var Router = require('./router')
  , Client = require('./client')
  , Presenter = require('./presenter')
  , PresenterBase = require('./presenter/base')
  , Database = require('./database')
  , ReceiverBase = require('./receiver/base')
  , ProfileReceiver = require('./receiver/profile_receiver')
  , RoomReceiver = require('./receiver/room_receiver')
  , utils = require('../utils');

var App = module.exports = function App (client, ioBoot) {
  this.ioBoot = ioBoot || io;
  this.client = new (client || Client)(this.ioBoot);
  this.database = new Database();
  this.registerDatabase(this.database);
}

utils.extend(App.prototype, {
  registerDatabase: function () {
    ModelExtensions.registerDatabase(this.database);
  },

  boot: function () {
    ReceiverBase.classMethods.setting(this);
    PresenterBase.classMethods.setting(this);
    this.router = new Router(this.client);
    this.client.start();
    new RoomReceiver();
    new ProfileReceiver();
  },
});
