(function (global) {
  var m = global.Model;
  m.Users = m.extend({
    bind: function () {
      this.data.users = [];
      this.client.on('enterRoom', this.onUserEnterRoom.bind(this));
      this.client.on('leaveRoom', this.onUserLeaveRoom.bind(this));
    },

    onUserEnterRoom: function (data) {
      var user = data.user;
      this.data.users.push(user);
    },

    onUserLeaveRoom: function (data) {
      var user = data.user;
      this.remove(this.data.users.$remove, user);
    },
  });

}(this));
