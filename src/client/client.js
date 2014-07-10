$(function() {
  var socket = io();

  socket.on('connect', function () {
    emit('login');
  });

  socket.on('receive', function (data) {
    console.log(data);
  });

  function emit(type, value) {
    socket.emit('notice', {
      type : type,
      user : 'new user',
      value : value,
    });
  }
});
