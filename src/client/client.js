(function (global) {
  global.Client = function Client() {
    this.socket = io();
    console.log("Connect with socketIO")
  }

  Client.prototype.on = function (type, callback) {
    this.socket.on(type, callback);
  }

  Client.prototype.submit = function emit(type, value) {
    console.log("Submit:", type, value)
    this.socket.emit('submit', {
      type: type,
      value: value,
    });
  }

}(this));
