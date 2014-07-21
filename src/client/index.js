var Page = require('./page');
var client = require('./client');
client.start();


$(function() { window.page = new Page(client); });
