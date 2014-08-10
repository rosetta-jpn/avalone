var App = require('./app');

var app = window.app = module.exports = new App();
$(function () { app.boot() });
