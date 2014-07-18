var vm = module.exports = {};

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

  var Selection = Vue.extend({
    data: {
      d: models.selection.data,
      dp: models.players.data
    },
    computed: {
      selection: function () {
        return this.d.selection;
      },
      players: function () {
        return this.dp.players;
      },
      isSelector: function () {
        return models.profile.data.user.id === this.selection.selector.id;
      },
    },
    filters: {
      without: function (user, remove) {
        var users = [];
        for (var i = 0; i < users.length; i++) {
          if (users[i].id !== remove.id)
            users.push(users[i]);
        }
        return users;
      },
      imagePath: function (klass) {
        return 'images/' + klass + '.jpg';
      },
    },
  });
  vm.userList = new Users({el: '.users'})
  vm.profile = new Profile({el: '.profile'})
  vm.otherJobs = new Players({el: '.other-jobs'})
  vm.voteSelectionInfo = new Selection({el: '#vote .selection-info'})
  vm.teamSelectionInfo = new Selection({el: '#team .selection-info'})
  vm.teamOrgForm = new Selection({el: '#team-org'})
}
