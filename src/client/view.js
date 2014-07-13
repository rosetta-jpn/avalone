
$(function() {
  var client = new Client();

  client.on('notice', function (data) {
    console.log(data.type + ':', data.value);
  });

  $('form#enterRoom').on('submit', function (e) {
    e.preventDefault();
    client.submit('enter', $(e.target).formData());
  });

});

