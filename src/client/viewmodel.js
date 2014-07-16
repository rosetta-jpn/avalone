(function(global){
  var vm = global.ViewModel = {};

  vm.boot = function (models) {

    var Users = Vue.extend({
      data: {
        d: models.users.data,
      },
      filters: {
        toClassName: function (id) {
          return 'user-' + id;
        },
      },
      computed: {
        users: function () {
          return this.d.users;
        }
      },
    });
    vm.userList = new Users({el: '.users'})
  }
}(this));
