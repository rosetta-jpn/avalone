var Page = require('./page');
var Client = require('./client');

var client = new Client();

$(function() { window.page = new Page(client); });
