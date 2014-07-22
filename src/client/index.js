require('../utils/extensions')

var Page = require('./page');
var client = require('./client');
var database = require('./database');
var ReceiverBase = require('./receiver/base')
var ProfileReceiver = require('./receiver/profile_receiver')
var RoomReceiver = require('./receiver/room_receiver')

client.start();

ReceiverBase.classMethods.setting(client, database);
new RoomReceiver();
new ProfileReceiver();

$(function() {
  window.database = database;
  window.page = new Page(client);
});
