var Client = function Client() {
  this.listening = {};
}

Client.prototype.on = function (type, callback) {
  var delayfunc = function (data) { setTimeout(callback, 0, data) };
  this.socket.on(type, delayfunc);
}

Client.prototype.submit = function emit(type, value) {
  console.log("Submit:", type, value)
  this.socket.emit('submit', {
    type: type,
    value: value,
  });
}

Client.prototype.start = function () {
  if (this.started) return;
  this.started = true;
  this.socket = io();
  console.log("Connect with socketIO")
}

Client.client = module.exports = new Client();

