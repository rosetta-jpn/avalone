var BasePresenter = require('./base')
  , utils = require('../../utils');

var GamePresenter = module.exports = utils.inherit(BasePresenter);

utils.extend(GamePresenter.prototype, {
  initialize: function () {
    this.prepareModel({
      game: this.database.game,
    });
    this.database.on('change:currentGame', this.onChangeCurrentGame.bind(this));
  },

  selector: '.rv-game',

  onChangeCurrentGame: function () {
    this.changeGame.apply(this, arguments);
  },

  changeGame: function (game) {
    this.model.game = game;
    this.update();
    utils.log('Update:Game', this.model);
  },

  formatters: {
    toClassName: function (name) { return 'game-' + name; },
    imagePath: function (name) { return 'images/' + name + '.jpg'; },
    stateImagePath : function (name) {return 'images/quest' + name +'.jpg';},
    winner: function (isJusticeWin) { return isJusticeWin ? 'Justice' : 'Evil'; },
    showIsApprove: function (isApprove) { return isApprove ? 'Approve' : 'Reject'; },
  },

  eventHandlers: {
    submitAssassinate: function (ev) {
      ev.preventDefault();
      this.client.submit('assassinate', this.model.game.target.toJson());
    },
  },
});

