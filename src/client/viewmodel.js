(function(global){
  var vm = global.ViewModel = {};

  vm.boot = function (models) {

    var Users = Vue.extend({
      data: {
        d: models.users.data,
      },
      computed: {
        users: function () {
          return this.d.users;
        }
      },
      filters: {
        toClassName: function (id) {
          return 'user-' + id;
        },
      },
    });

    var Profile = Vue.extend({
      data: {
        d: models.profile.data,
      },
      computed: {
        player: function () {
          return this.d.player;
        },
      },
      filters: {
        imagePath: function (klass) {
          return 'images/' + klass + '.jpg';
        },
      },
    });

    var Players = Vue.extend({
      data: {
        d: models.players.data,
      },
      computed: {
        players: function () {
          return this.d.players;
        },
      },
      filters: {
        imagePath: function (klass) {
          return 'images/' + klass + '.jpg';
        },
      },
    });

    vm.userList = new Users({el: '.users'})
    vm.profile = new Profile({el: '.profile'})
    vm.otherJobs = new Players({el: '.other-jobs'})
  }
}(this));
