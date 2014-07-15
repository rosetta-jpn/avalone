var chai = require('chai')
  , sinon = require('sinon')
  , sinonChai = require('sinon-chai');

chai.use(sinonChai);
var expect = chai.expect;

require('../src/utils/extensions');

var Avalon = require('../src/models/avalon')
  , User = require('../src/models/user')
  , RoomObserver = require('../src/observers/room_observer');

exports.createRoom = function (ctx) {
  ctx.avalon = ctx.avalon || new Avalon();

  var sockets = ['hoge', 'fuga', 'java', 'gava', 'yaba'].map(function (name) {
    return { id: name, emit: function () {} };
  });
  ctx.sockets = sockets;

  var users = sockets.map(function (socket) {
    return ctx.avalon.login(socket, socket.id);
  });
  ctx.users = users;
  ctx.user = users[0];

  ctx.room = ctx.avalon.createRoom(ctx.user, 'room');
  new RoomObserver(ctx.room, ctx.avalon);

  for (var i = 1; i < users.length; i++) ctx.room.enter(users[i]);
}

exports.spyRoomMembers = function (ctx) {
  ctx.users.forEach(function (user) {
    user.socket.emit = sinon.spy();
  });
}
