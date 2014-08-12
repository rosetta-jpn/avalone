var BasePresenter = require('./base')
  , utils = require('../../utils');

GamePresenter = module.exports = function (range) {
  this.prepareModel({
    game: this.database.game,
  });
  this.bind(range);

  this.database.on('change:currentGame', this.onChangeCurrentGame.bind(this));
}

utils.inherit(BasePresenter, GamePresenter);

GamePresenter.prototype.selector = '.rv-game'

GamePresenter.prototype.onChangeCurrentGame = function () {
  this.changeGame.apply(this, arguments);
}
GamePresenter.prototype.changeGame = function (game) {
  this.model.game = game;
  this.update();
  console.log('Update:Game', this.model);
}

GamePresenter.prototype.formatters = {
  toClassName: function (name) { return 'game-' + name; },
  imagePath: function (name) { return 'images/' + name + '.jpg'; },
  stateImagePath : function (name) {return 'images/quest' + name +'.jpg';},
  winner: function (isJusticeWin) { return isJusticeWin ? 'Justice' : 'Evil'; },
  showIsApprove: function (isApprove) { return isApprove ? 'Approve' : 'Reject'; },
}

GamePresenter.prototype.eventHandlers = {
  submitAssassinate: function (ev) {
    ev.preventDefault();
    this.client.submit('assassinate', this.model.game.target.toJson());
  },
}

