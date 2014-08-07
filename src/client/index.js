require('../utils/extensions')
require('./rivets_config')
require('./model_extensions')

var Router = require('./router');
var client = require('./client');
var Presenter = require('./presenter');
var database = require('./database');
var ReceiverBase = require('./receiver/base')
var ProfileReceiver = require('./receiver/profile_receiver')
var RoomReceiver = require('./receiver/room_receiver')

$(function() {
  var router = window.router = new Router(client);
  ReceiverBase.classMethods.setting(client, database, router);

  window.database = database;
  client.start();

  new RoomReceiver();
  new ProfileReceiver();
});
