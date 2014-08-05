var BasePresenter = require('./base')
  , utils = require('../../utils');

GamePresenter = module.exports = function () {
  this.$el = $('.rv-game')
  this.model = {
    game: this.database.game,
  };
  this.bind();

  this.database.on('new:Game', this.changeGame.bind(this));
}

utils.inherit(BasePresenter, GamePresenter);

GamePresenter.prototype.changeGame = function (game) {
  this.model.game = game;
  this.update();
  console.log('Update:Game', this.model);
}

GamePresenter.prototype.formatters = {
  toClassName: function (name) { return 'game-' + name; },
  imagePath: function (name) { return 'images/' + name + '.jpg'; },
}

